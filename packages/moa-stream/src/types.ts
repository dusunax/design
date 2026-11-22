import type { Message } from "@ag-ui/core";

export type RunStatus = "idle" | "running" | "finished" | "error";

/** moa ToolCallCard props와 같은 이름을 쓴다. */
export type ToolCallState = {
  id: string;
  name: string;
  /** TOOL_CALL_ARGS 조각을 이어 붙인 원문 */
  args: string;
  result?: string;
  status: "running" | "finished" | "error";
};

export type StreamState = {
  runStatus: RunStatus;
  /** role "activity" 메시지도 들어 있다 */
  messages: Message[];
  toolCalls: Record<string, ToolCallState>;
  /** STATE_SNAPSHOT·STATE_DELTA로 만든 공유 state */
  state: unknown;
  error?: { message: string; code?: string };
};
