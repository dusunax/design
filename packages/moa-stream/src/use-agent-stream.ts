import type { BaseEvent, Message } from "@ag-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { initialState, reduceEvent } from "./reduce";
import type { StreamState } from "./types";

export type AgentStream = {
  state: StreamState;
  /** newMessages(보통 사용자 메시지)를 messages 끝에 붙인 뒤 이벤트를 읽는다. 실행 중이면 이전 실행을 끊는다. */
  run: (source: AsyncIterable<BaseEvent>, newMessages?: Message[]) => Promise<void>;
  abort: () => void;
};

export function useAgentStream(): AgentStream {
  const [state, setState] = useState<StreamState>(initialState);
  const current = useRef<AsyncIterator<BaseEvent> | null>(null);

  const stop = useCallback(() => {
    const it = current.current;
    current.current = null;
    void it?.return?.();
  }, []);

  const abort = useCallback(() => {
    stop();
    setState((s) => ({ ...s, runStatus: "idle" }));
  }, [stop]);

  const run = useCallback(
    async (source: AsyncIterable<BaseEvent>, newMessages: Message[] = []) => {
      stop();
      const it = source[Symbol.asyncIterator]();
      current.current = it;
      setState((s) => ({
        ...s,
        runStatus: "idle",
        error: undefined,
        toolCalls: {},
        messages: newMessages.length ? [...s.messages, ...newMessages] : s.messages,
      }));
      try {
        while (current.current === it) {
          const r = await it.next();
          // 기다리는 사이에 끊겼으면 늦게 온 이벤트는 버린다.
          if (r.done || current.current !== it) break;
          setState((s) => reduceEvent(s, r.value));
        }
      } catch (err) {
        if (current.current === it) {
          setState((s) => ({ ...s, runStatus: "error", error: { message: err instanceof Error ? err.message : String(err) } }));
        }
      } finally {
        if (current.current === it) current.current = null;
      }
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { state, run, abort };
}
