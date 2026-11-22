// OpenRouter chat/completions 스트림(OpenAI 호환 SSE)을 AG-UI 이벤트로 바꾼다.
import { type BaseEvent, EventType } from "@ag-ui/core";
import { checkRenderUi } from "./validate";

export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type Delta = { content?: string | null; tool_calls?: { index?: number; function?: { name?: string; arguments?: string } }[] };
type Chunk = { error?: unknown; choices?: { delta?: Delta; finish_reason?: string | null }[] };

const ev = (e: Record<string, unknown>): BaseEvent => e as BaseEvent;

export const WRONG_FORMAT = "The model sent a card in the wrong format, so it was not shown.";
export const NO_RENDER_UI = "This model did not call render_ui, so no card was drawn. It may not be good at drawing UI; try another model.";

/** data: 줄의 JSON을 차례로 낸다. [DONE]이면 멈춘다. 끝까지 [DONE]이 없으면 마지막에 null을 낸다. */
async function* chunks(body: ReadableStream<Uint8Array>): AsyncGenerator<Chunk | null> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer = (buffer + decoder.decode(value, { stream: !done })).replaceAll("\r\n", "\n");
      let end = buffer.indexOf("\n");
      while (end >= 0) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        if (line.startsWith("data:")) {
          const data = line.slice(5).trim();
          if (data === "[DONE]") return;
          try {
            yield JSON.parse(data) as Chunk;
          } catch {
            yield null;
            return;
          }
        }
        end = buffer.indexOf("\n");
      }
      if (done) {
        yield null;
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 텍스트는 TEXT_MESSAGE 이벤트로 흘려보내고, render_ui 인자는 끝까지 모은 뒤 검증해 ACTIVITY_SNAPSHOT 하나로 낸다.
 * TOOL_CALL 이벤트는 내지 않는다. RUN_STARTED·RUN_FINISHED는 부르는 쪽이 붙인다.
 * 스트림이 끊기거나 오류가 오면 RUN_ERROR를 내고 끝난다. 반환값은 끝까지 받았는지다.
 */
export async function* toAgUiEvents(body: ReadableStream<Uint8Array>, runId: string): AsyncGenerator<BaseEvent, boolean> {
  let n = 0;
  const id = (prefix: string) => `${prefix}-${runId}-${++n}`;
  let textId: string | undefined;
  const calls = new Map<number, { name: string; args: string }>();
  let finished = false;
  let upstreamError = false;

  for await (const chunk of chunks(body)) {
    if (chunk === null) break;
    // 스트림 중간의 오류. 내용에는 무엇이 들었는지 모르므로 옮기지 않는다.
    if (chunk.error !== undefined) {
      upstreamError = true;
      break;
    }
    const choice = chunk.choices?.[0];
    const delta = choice?.delta;
    if (delta?.content) {
      if (!textId) {
        textId = id("m");
        yield ev({ type: EventType.TEXT_MESSAGE_START, messageId: textId, role: "assistant" });
      }
      yield ev({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: textId, delta: delta.content });
    }
    for (const t of delta?.tool_calls ?? []) {
      const call = calls.get(t.index ?? 0) ?? { name: "", args: "" };
      call.name += t.function?.name ?? "";
      call.args += t.function?.arguments ?? "";
      calls.set(t.index ?? 0, call);
    }
    if (choice?.finish_reason) {
      finished = choice.finish_reason !== "error";
      break;
    }
  }

  if (textId) yield ev({ type: EventType.TEXT_MESSAGE_END, messageId: textId });
  if (!finished) {
    yield ev(
      upstreamError
        ? { type: EventType.RUN_ERROR, message: "The model provider returned an error.", code: "upstream_error" }
        : { type: EventType.RUN_ERROR, message: "The model response was cut off.", code: "upstream_incomplete" },
    );
    return false;
  }

  const say = function* (content: string) {
    const messageId = id("m");
    yield ev({ type: EventType.TEXT_MESSAGE_START, messageId, role: "assistant" });
    yield ev({ type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: content });
    yield ev({ type: EventType.TEXT_MESSAGE_END, messageId });
  };

  const uis = [...calls.values()].filter((c) => c.name === "render_ui");
  if (!uis.length) yield* say(NO_RENDER_UI);
  for (const call of uis) {
    const checked = checkRenderUi(call.args);
    if (checked.ok) {
      yield ev({ type: EventType.ACTIVITY_SNAPSHOT, messageId: id("ui"), activityType: "moa-ui", content: { messages: checked.messages } });
    } else {
      yield* say(`${WRONG_FORMAT} (${[...new Set(checked.errors)].join(", ")})`);
    }
  }
  return true;
}
