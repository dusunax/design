import type { ActivityMessage, AssistantMessage, BaseEvent } from "@ag-ui/core";
import { badPatch, chat, toolCall, uiCard } from "@dusunax/moa-fixtures";
import { initialState, reduceEvent } from "./reduce";
import type { StreamState } from "./types";

const run = (events: readonly unknown[], from: StreamState = initialState): StreamState =>
  (events as BaseEvent[]).reduce(reduceEvent, from);
const ev = (e: Record<string, unknown>): BaseEvent => e as unknown as BaseEvent;

test("streams text messages", () => {
  const state = run(chat);
  expect(state.messages).toHaveLength(1);
  expect((state.messages[0] as AssistantMessage).content).toBe("Hello, how can I help?");
  expect(state.runStatus).toBe("finished");
});

test("tracks tool calls", () => {
  const mid = run(toolCall.slice(0, 4));
  expect(mid.toolCalls.t1).toMatchObject({ name: "get_weather", args: '{"city":"Seoul"}', status: "running" });
  const done = run(toolCall);
  expect(done.toolCalls.t1).toMatchObject({ result: "Sunny, 18°C", status: "finished" });
  expect(done.runStatus).toBe("finished");
});

test("joins text parts of tool results", () => {
  const state = run([
    { type: "TOOL_CALL_START", toolCallId: "t1", toolCallName: "search" },
    { type: "TOOL_CALL_RESULT", messageId: "m1", toolCallId: "t1", content: [{ type: "text", text: "a" }, { type: "image", source: { type: "url", value: "x" } }, { type: "text", text: "b" }] },
  ]);
  expect(state.toolCalls.t1?.result).toBe("ab");
});

test("marks unfinished tool calls as error on RUN_ERROR", () => {
  const state = run([
    { type: "TOOL_CALL_START", toolCallId: "t1", toolCallName: "search" },
    { type: "RUN_ERROR", message: "boom", code: "429" },
  ]);
  expect(state.toolCalls.t1?.status).toBe("error");
  expect(state.runStatus).toBe("error");
  expect(state.error).toEqual({ message: "boom", code: "429" });
});

test("creates and patches activity messages", () => {
  const state = run(uiCard);
  const activities = state.messages.filter((m): m is ActivityMessage => m.role === "activity");
  expect(activities.map((m) => m.id)).toEqual(["ui-1", "ui-2"]);
  expect(activities[0]?.content.messages).toHaveLength(2);
  expect(activities[1]?.content.messages).toHaveLength(1);
});

test("keeps activity when replace is false", () => {
  const snapshot = { type: "ACTIVITY_SNAPSHOT", messageId: "ui-1", activityType: "moa-ui" };
  const state = run([
    { ...snapshot, content: { v: 1 } },
    { ...snapshot, content: { v: 2 }, replace: false },
  ]);
  expect((state.messages[0] as ActivityMessage).content).toEqual({ v: 1 });
  const replaced = reduceEvent(state, ev({ ...snapshot, content: { v: 3 } }));
  expect((replaced.messages[0] as ActivityMessage).content).toEqual({ v: 3 });
});

test("applies add and replace with array index and dash", () => {
  const state = run([
    { type: "STATE_SNAPSHOT", snapshot: { list: ["a", "c"], n: 1 } },
    { type: "STATE_DELTA", delta: [
      { op: "add", path: "/list/1", value: "b" },
      { op: "add", path: "/list/-", value: "d" },
      { op: "replace", path: "/n", value: 2 },
      { op: "add", path: "/new", value: true },
    ] },
  ]);
  expect(state.state).toEqual({ list: ["a", "b", "c", "d"], n: 2, new: true });
  expect(state.error).toBeUndefined();
});

test("rejects prototype paths", () => {
  const state = run(badPatch.slice(0, 3));
  expect(state.state).toEqual({ count: 1 });
  expect(state.error?.code).toBe("PATCH_REJECTED");
  expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  for (const path of ["/constructor/prototype/x", "/a/prototype"]) {
    const s = reduceEvent(run(badPatch.slice(0, 2)), ev({ type: "STATE_DELTA", delta: [{ op: "add", path, value: 1 }] }));
    expect(s.state).toEqual({ count: 1 });
  }
});

test("rejects unsupported ops", () => {
  const state = run(badPatch.slice(0, 4).filter((_, i) => i !== 2));
  expect(state.state).toEqual({ count: 1 });
  expect(state.error?.code).toBe("PATCH_REJECTED");
  expect(state.runStatus).toBe("running");
  const all = run(badPatch);
  expect(all.state).toEqual({ count: 2 });
});

test("ignores unknown events and ids", () => {
  const before = run(chat.slice(0, 2));
  for (const e of [
    { type: "STEP_STARTED", stepName: "x" },
    { type: "MESSAGES_SNAPSHOT", messages: [] },
    { type: "TEXT_MESSAGE_CONTENT", messageId: "nope", delta: "x" },
    { type: "TOOL_CALL_ARGS", toolCallId: "nope", delta: "x" },
    { type: "ACTIVITY_DELTA", messageId: "nope", activityType: "moa-ui", patch: [] },
  ]) {
    expect(reduceEvent(before, ev(e))).toBe(before);
  }
});

test("does not mutate previous state", () => {
  const before = run(uiCard.slice(0, 5));
  const frozen = JSON.stringify(before);
  run(uiCard.slice(5), before);
  run([{ type: "STATE_SNAPSHOT", snapshot: { a: [1] } }, { type: "STATE_DELTA", delta: [{ op: "add", path: "/a/-", value: 2 }] }], before);
  expect(JSON.stringify(before)).toBe(frozen);
});
