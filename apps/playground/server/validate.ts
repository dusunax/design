// 요청 검증과 render_ui 인자 검증. A2UI 형식과 id 참조는 moa-render/core로 본다.
import { type A2uiMessage, checkSurfaces, type MoaAction, type MoaRenderError, toSurfaces } from "@dusunax/moa-render/core";
import { DEFAULT_MODEL, isModelName } from "./model.ts";

export const MAX_BODY_BYTES = 256 * 1024;
export const MAX_MESSAGES = 100;
export const MAX_RENDER_UI_BYTES = 64 * 1024;
export const MAX_ACTION_BYTES = 4 * 1024;

export type InputMessage = { id?: string; role: string; content?: unknown; activityType?: string };

export type AgentInput = {
  threadId: string;
  runId: string;
  messages: InputMessage[];
  model: string;
  moaAction?: { messageId: string; action: MoaAction };
};

export type Invalid = { ok: false; status: 400 | 413; message: string };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 200;
const bytes = (s: string): number => new TextEncoder().encode(s).length;

// 오류 문구는 고정한다. 요청의 값을 넣지 않는다.
const invalid = (message: string, status: 400 | 413 = 400): Invalid => ({ ok: false, status, message });

function isAction(v: unknown): v is MoaAction {
  return (
    isRecord(v) &&
    isId(v.name) &&
    isId(v.surfaceId) &&
    isId(v.sourceComponentId) &&
    typeof v.timestamp === "string" &&
    isRecord(v.context) &&
    (v.userMessage === undefined || typeof v.userMessage === "string")
  );
}

/** RunAgentInput 중 서버가 쓰는 부분만 검증한다. */
export function parseInput(value: unknown): { ok: true; input: AgentInput } | Invalid {
  if (!isRecord(value) || !isId(value.threadId) || !isId(value.runId) || !Array.isArray(value.messages)) return invalid("Invalid RunAgentInput");
  if (value.messages.length > MAX_MESSAGES) return invalid("Too many messages", 413);
  if (!value.messages.every((m) => isRecord(m) && typeof m.role === "string")) return invalid("Invalid message");

  const props = value.forwardedProps === undefined ? {} : value.forwardedProps;
  if (!isRecord(props)) return invalid("Invalid forwardedProps");

  const model = props.model === undefined ? DEFAULT_MODEL : props.model;
  if (!isModelName(model)) return invalid("Invalid model name");

  let moaAction: AgentInput["moaAction"];
  if (props.moaAction !== undefined) {
    if (bytes(JSON.stringify(props.moaAction)) > MAX_ACTION_BYTES) return invalid("moaAction is too large", 413);
    const a = props.moaAction;
    if (!isRecord(a) || !isId(a.messageId) || !isAction(a.action)) return invalid("Invalid moaAction");
    moaAction = { messageId: a.messageId, action: a.action };
  }

  return { ok: true, input: { threadId: value.threadId, runId: value.runId, messages: value.messages as InputMessage[], model, moaAction } };
}

/** render_ui 인자(surface 하나) 원문을 A2UI 메시지 배열로 감싸고 검증한다. */
export function checkRenderUi(raw: string): { ok: true; messages: A2uiMessage[] } | { ok: false; errors: string[] } {
  if (bytes(raw) > MAX_RENDER_UI_BYTES) return { ok: false, errors: ["TOO_LARGE"] };
  let args: unknown;
  try {
    args = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ["INVALID_JSON"] };
  }
  if (!isRecord(args)) return { ok: false, errors: ["NOT_OBJECT"] };
  const messages = [{ version: "1.0", createSurface: args }] as A2uiMessage[];
  const { surfaces, errors } = toSurfaces(messages);
  const all: MoaRenderError[] = [...errors, ...checkSurfaces(surfaces)];
  return all.length ? { ok: false, errors: all.map((e) => e.code) } : { ok: true, messages };
}
