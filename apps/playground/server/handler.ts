// /api/agent 핸들러. 방문자 키로 OpenRouter를 부르고 응답을 AG-UI 이벤트 SSE로 돌려준다.
// 키는 OpenRouter 호출에만 쓴다. 로그를 남기지 않고, 오류 문구는 고정한다.
import { type BaseEvent, EventType } from "@ag-ui/core";
import { OPENROUTER_URL, toAgUiEvents } from "./openrouter.ts";
import { RENDER_UI_TOOL, SYSTEM_PROMPT } from "./prompt.ts";
import { type AgentInput, type InputMessage, MAX_BODY_BYTES, parseInput } from "./validate.ts";

type Deps = { fetch: typeof fetch };
type ModelMessage = { role: "system" | "user" | "assistant"; content: string };

const json = (status: number, message: string): Response =>
  new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** 본문을 상한까지만 읽는다. 넘으면 null. */
async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    parts.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const p of parts) {
    all.set(p, at);
    at += p.length;
  }
  return new TextDecoder().decode(all);
}

const textOf = (content: unknown): string =>
  typeof content === "string"
    ? content
    : Array.isArray(content)
      ? content.filter((p) => isRecord(p) && p.type === "text" && typeof p.text === "string").map((p) => p.text).join("\n")
      : "";

/** OpenRouter는 activity role을 모른다. 카드는 모델이 쓰는 형식(createSurface 안쪽)으로 assistant 텍스트에 담는다. */
function toModelMessage(m: InputMessage): ModelMessage | undefined {
  if (m.role === "user") {
    const content = textOf(m.content);
    return content ? { role: "user", content } : undefined;
  }
  if (m.role === "assistant") {
    const content = textOf(m.content);
    return content ? { role: "assistant", content } : undefined;
  }
  if (m.role === "activity" && m.activityType === "moa-ui" && isRecord(m.content) && Array.isArray(m.content.messages)) {
    const surfaces = m.content.messages.filter((x) => isRecord(x) && isRecord(x.createSurface)).map((x) => JSON.stringify(x.createSurface));
    return surfaces.length ? { role: "assistant", content: `이 화면을 보여 줌: ${surfaces.join("\n")}` } : undefined;
  }
  // system·developer·tool 메시지는 넘기지 않는다. 시스템 프롬프트는 서버가 정한다.
  return undefined;
}

function modelMessages(input: AgentInput): ModelMessage[] {
  const out: ModelMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  for (const m of input.messages) {
    const converted = toModelMessage(m);
    if (converted) out.push(converted);
  }
  // action은 사용자 입력과 같은 신뢰 수준으로 넘긴다(SEC-3.5).
  if (input.moaAction) {
    out.push({ role: "user", content: `I used card ${input.moaAction.messageId}: ${JSON.stringify(input.moaAction.action)}` });
  }
  return out;
}

const LIMIT_SOURCE = /^[a-z_]{1,64}$/;

/** OpenRouter의 HTTP 오류를 RUN_ERROR로. code는 `openrouter_<상태>`이고, 429에는 limit_source를 붙인다. 앱은 이것으로 Firewall 429(code "429")와 구분한다. */
async function upstreamError(res: Response): Promise<BaseEvent> {
  let code = `openrouter_${res.status}`;
  if (res.status === 429) {
    const body: unknown = await res.json().catch(() => undefined);
    const source = isRecord(body) && isRecord(body.error) && isRecord(body.error.metadata) ? body.error.metadata.limit_source : undefined;
    if (typeof source === "string" && LIMIT_SOURCE.test(source)) code += `:${source}`;
  }
  return { type: EventType.RUN_ERROR, message: `The model provider returned HTTP ${res.status}.`, code } as BaseEvent;
}

async function* run(input: AgentInput, key: string, deps: Deps): AsyncGenerator<BaseEvent> {
  const { threadId, runId } = input;
  yield { type: EventType.RUN_STARTED, threadId, runId } as BaseEvent;
  let res: Response;
  try {
    res = await deps.fetch(OPENROUTER_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: input.model, stream: true, messages: modelMessages(input), tools: [RENDER_UI_TOOL], tool_choice: "auto" }),
    });
  } catch {
    yield { type: EventType.RUN_ERROR, message: "Could not reach the model provider.", code: "openrouter_unreachable" } as BaseEvent;
    return;
  }
  if (!res.ok || !res.body) {
    yield await upstreamError(res);
    return;
  }
  const events = toAgUiEvents(res.body, runId);
  let step = await events.next();
  while (!step.done) {
    yield step.value;
    step = await events.next();
  }
  if (step.value) yield { type: EventType.RUN_FINISHED, threadId, runId } as BaseEvent;
}

function sse(events: AsyncGenerator<BaseEvent>): Response {
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await events.next();
        if (done) controller.close();
        else controller.enqueue(enc.encode(`data: ${JSON.stringify(value)}\n\n`));
      } catch {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: EventType.RUN_ERROR, message: "Server error.", code: "server_error" })}\n\n`));
        controller.close();
      }
    },
    async cancel() {
      await events.return(undefined);
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" } });
}

export async function handleAgent(request: Request, deps: Deps): Promise<Response> {
  try {
    const key = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
    if (!key) return json(401, "Missing API key");

    const raw = await readBody(request);
    if (raw === null) return json(413, "Request body is too large");
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, "Invalid JSON");
    }
    const parsed = parseInput(body);
    if (!parsed.ok) return json(parsed.status, parsed.message);

    return sse(run(parsed.input, key, deps));
  } catch {
    return json(500, "Server error");
  }
}
