import { type ActivityMessage, type BaseEvent, EventType, type Message } from "@ag-ui/core";
import { applyPatch } from "./json-patch";
import type { StreamState, ToolCallState } from "./types";

export const initialState: StreamState = { runStatus: "idle", messages: [], toolCalls: {}, state: undefined };

// 이벤트 필드는 @ag-ui/core 스키마를 따른다. 검증은 하지 않으므로 읽을 때 형태만 좁힌다.
type Fields = Record<string, unknown>;
const str = (v: unknown): string => (typeof v === "string" ? v : "");

function updateMessage(state: StreamState, id: string, update: (m: Message) => Message | undefined): StreamState {
  const i = state.messages.findIndex((m) => m.id === id);
  const current = state.messages[i];
  if (!current) return state;
  const next = update(current);
  if (!next) return state;
  const messages = state.messages.slice();
  messages[i] = next;
  return { ...state, messages };
}

function updateToolCall(state: StreamState, id: string, update: (t: ToolCallState) => ToolCallState): StreamState {
  const current = state.toolCalls[id];
  return current ? { ...state, toolCalls: { ...state.toolCalls, [id]: update(current) } } : state;
}

function textOf(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((p: Fields) => (p?.type === "text" ? str(p.text) : "")).join("");
}

const rejected = (state: StreamState, reason: string): StreamState => ({ ...state, error: { message: reason, code: "PATCH_REJECTED" } });

export function reduceEvent(state: StreamState, event: BaseEvent): StreamState {
  const e = event as unknown as Fields;
  switch (event.type) {
    case EventType.RUN_STARTED:
      return { ...state, runStatus: "running", error: undefined };
    case EventType.RUN_FINISHED:
      return { ...state, runStatus: "finished" };
    case EventType.RUN_ERROR: {
      const toolCalls = Object.fromEntries(
        Object.entries(state.toolCalls).map(([id, t]) => [id, t.status === "running" ? { ...t, status: "error" as const } : t]),
      );
      const error = { message: str(e.message), ...(typeof e.code === "string" ? { code: e.code } : {}) };
      return { ...state, runStatus: "error", error, toolCalls };
    }
    case EventType.TEXT_MESSAGE_START: {
      const id = str(e.messageId);
      if (state.messages.some((m) => m.id === id)) return state;
      const role = typeof e.role === "string" ? e.role : "assistant";
      return { ...state, messages: [...state.messages, { id, role, content: "" } as Message] };
    }
    case EventType.TEXT_MESSAGE_CONTENT:
      return updateMessage(state, str(e.messageId), (m) =>
        "content" in m && typeof m.content === "string" ? ({ ...m, content: m.content + str(e.delta) } as Message) : undefined,
      );
    case EventType.TOOL_CALL_START: {
      const id = str(e.toolCallId);
      const call: ToolCallState = { id, name: str(e.toolCallName), args: "", status: "running" };
      return { ...state, toolCalls: { ...state.toolCalls, [id]: call } };
    }
    case EventType.TOOL_CALL_ARGS:
      return updateToolCall(state, str(e.toolCallId), (t) => ({ ...t, args: t.args + str(e.delta) }));
    case EventType.TOOL_CALL_RESULT:
      return updateToolCall(state, str(e.toolCallId), (t) => ({ ...t, result: textOf(e.content), status: "finished" }));
    case EventType.STATE_SNAPSHOT:
      return { ...state, state: e.snapshot };
    case EventType.STATE_DELTA: {
      const r = applyPatch(state.state, (e.delta ?? []) as never);
      return r.ok ? { ...state, state: r.value } : rejected(state, r.reason);
    }
    case EventType.ACTIVITY_SNAPSHOT: {
      const id = str(e.messageId);
      const content = (e.content ?? {}) as ActivityMessage["content"];
      const activityType = str(e.activityType);
      if (!state.messages.some((m) => m.id === id)) {
        const message: ActivityMessage = { id, role: "activity", activityType, content };
        return { ...state, messages: [...state.messages, message] };
      }
      if (e.replace === false) return state;
      return updateMessage(state, id, (m) => (m.role === "activity" ? { ...m, activityType, content } : undefined));
    }
    case EventType.ACTIVITY_DELTA: {
      const target = state.messages.find((m) => m.id === str(e.messageId));
      if (target?.role !== "activity") return state;
      const r = applyPatch(target.content, (e.patch ?? []) as never);
      if (!r.ok) return rejected(state, r.reason);
      return updateMessage(state, target.id, (m) => ({ ...m, content: r.value as ActivityMessage["content"] }) as Message);
    }
    default:
      return state;
  }
}
