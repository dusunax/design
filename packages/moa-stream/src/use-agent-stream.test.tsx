import type { BaseEvent, Message } from "@ag-ui/core";
import { chat, replay } from "@dusunax/moa-fixtures";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAgentStream } from "./use-agent-stream";

const events = (list: readonly unknown[]): AsyncIterable<BaseEvent> => replay(list as BaseEvent[]);

/** 첫 이벤트를 낸 뒤 release()가 불릴 때까지 멈추는 스트림 */
function hanging(first: unknown, later: unknown) {
  let release: () => void = () => {};
  const gate = new Promise<void>((r) => (release = r));
  const status = { closed: false };
  async function* gen(): AsyncGenerator<BaseEvent> {
    try {
      yield first as BaseEvent;
      await gate;
      yield later as BaseEvent;
    } finally {
      status.closed = true;
    }
  }
  return { source: gen(), release, status };
}

test("run appends new messages before events", async () => {
  const { result } = renderHook(() => useAgentStream());
  const user: Message = { id: "u1", role: "user", content: "hi" };
  await act(() => result.current.run(events(chat), [user]));
  expect(result.current.state.messages.map((m) => m.role)).toEqual(["user", "assistant"]);
  expect(result.current.state.runStatus).toBe("finished");
});

test("run aborts the previous run", async () => {
  const { result } = renderHook(() => useAgentStream());
  const first = hanging({ type: "RUN_STARTED", threadId: "t", runId: "old" }, { type: "STATE_SNAPSHOT", snapshot: "late" });
  act(() => void result.current.run(first.source));
  await waitFor(() => expect(result.current.state.runStatus).toBe("running"));
  await act(() => result.current.run(events(chat)));
  first.release();
  await waitFor(() => expect(first.status.closed).toBe(true));
  expect(result.current.state.state).toBeUndefined();
  expect(result.current.state.runStatus).toBe("finished");
});

test("abort returns to idle", async () => {
  const { result } = renderHook(() => useAgentStream());
  const stream = hanging({ type: "RUN_STARTED", threadId: "t", runId: "r" }, { type: "RUN_FINISHED", threadId: "t", runId: "r" });
  act(() => void result.current.run(stream.source));
  await waitFor(() => expect(result.current.state.runStatus).toBe("running"));
  act(() => result.current.abort());
  expect(result.current.state.runStatus).toBe("idle");
  stream.release();
  await waitFor(() => expect(stream.status.closed).toBe(true));
  expect(result.current.state.runStatus).toBe("idle");
});

test("turns thrown errors into error state", async () => {
  const { result } = renderHook(() => useAgentStream());
  async function* broken(): AsyncGenerator<BaseEvent> {
    yield { type: "RUN_STARTED", threadId: "t", runId: "r" } as BaseEvent;
    throw new Error("network down");
  }
  await act(() => result.current.run(broken()));
  expect(result.current.state.runStatus).toBe("error");
  expect(result.current.state.error?.message).toBe("network down");
});
