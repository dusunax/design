import type { BaseEvent } from "@ag-ui/core";
import { parseSse } from "@dusunax/moa-stream";
import { handleAgent } from "./handler";
import { DEFAULT_MODEL } from "./model";

const KEY = "sk-or-v1-test-secret-key";
const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const fixtures = import.meta.glob<string>("./fixtures/*.txt", { query: "?raw", import: "default", eager: true });
const fixture = (name: string): string => fixtures[`./fixtures/${name}.txt`] ?? "";

// OpenRouter 대신 녹화본을 돌려주고, 받은 요청을 기록한다.
const upstream = (body: string, response: ResponseInit = { status: 200, headers: { "Content-Type": "text/event-stream" } }) => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(body, response);
  }) as typeof globalThis.fetch;
  return { fetch, calls, sent: () => JSON.parse(String(calls[0]?.init.body)) };
};

const input = (over: Record<string, unknown> = {}) => ({
  threadId: "t1",
  runId: "r1",
  messages: [{ id: "u1", role: "user", content: "Show me a sign up form." }],
  tools: [],
  context: [],
  ...over,
});

const request = (body: unknown, headers: Record<string, string> = { Authorization: `Bearer ${KEY}` }) =>
  new Request("http://localhost/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const events = async (res: Response): Promise<BaseEvent[]> => {
  const out: BaseEvent[] = [];
  if (res.body) for await (const e of parseSse(res.body)) out.push(e);
  return out;
};
const text = (list: BaseEvent[]) =>
  list.filter((e) => e.type === "TEXT_MESSAGE_CONTENT").map((e) => (e as unknown as { delta: string }).delta).join("");

test("rejects missing key with 401", async () => {
  const up = upstream(fixture("text"));
  const res = await handleAgent(request(input(), {}), up);
  expect(res.status).toBe(401);
  expect(up.calls).toHaveLength(0);
});

test("rejects oversized body with 413", async () => {
  const up = upstream(fixture("text"));
  const big = input({ messages: [{ id: "u1", role: "user", content: "x".repeat(300 * 1024) }] });
  expect((await handleAgent(request(big), up)).status).toBe(413);
  const many = input({ messages: Array.from({ length: 101 }, (_, i) => ({ id: `u${i}`, role: "user", content: "hi" })) });
  expect((await handleAgent(request(many), up)).status).toBe(413);
  const action = input({ forwardedProps: { moaAction: { messageId: "ui-1", action: { name: "a", surfaceId: "s", sourceComponentId: "b", timestamp: "t", context: { note: "x".repeat(5000) } } } } });
  expect((await handleAgent(request(action), up)).status).toBe(413);
  expect(up.calls).toHaveLength(0);
});

test("streams text as TEXT_MESSAGE events", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("text"))));
  expect(list.map((e) => e.type)).toEqual([
    "RUN_STARTED",
    "TEXT_MESSAGE_START",
    "TEXT_MESSAGE_CONTENT",
    "TEXT_MESSAGE_CONTENT",
    "TEXT_MESSAGE_END",
    "TEXT_MESSAGE_START",
    "TEXT_MESSAGE_CONTENT",
    "TEXT_MESSAGE_END",
    "RUN_FINISHED",
  ]);
  expect(text(list.slice(0, 5))).toBe("Hello! How can I help?");
});

test("turns render_ui into ACTIVITY_SNAPSHOT without TOOL_CALL events", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("render-ui"))));
  expect(list.some((e) => e.type.startsWith("TOOL_CALL"))).toBe(false);
  const snapshots = list.filter((e) => e.type === "ACTIVITY_SNAPSHOT");
  expect(snapshots).toHaveLength(1);
  expect(snapshots[0]).toMatchObject({ activityType: "moa-ui" });
  expect(text(list)).toBe("Here is the form.");
  expect(list.at(-1)?.type).toBe("RUN_FINISHED");
});

test("wraps render_ui arguments into a createSurface message", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("render-ui"))));
  const snapshot = list.find((e) => e.type === "ACTIVITY_SNAPSHOT") as unknown as { content: { messages: unknown[] } };
  expect(snapshot.content.messages).toEqual([
    { version: "1.0", createSurface: expect.objectContaining({ surfaceId: "signup", dataModel: { name: "", email: "" } }) },
  ]);
});

test("rejects render_ui with missing id references", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("render-ui-missing-id"))));
  expect(list.some((e) => e.type === "ACTIVITY_SNAPSHOT")).toBe(false);
  expect(text(list)).toMatch(/wrong format/);
  expect(list.at(-1)?.type).toBe("RUN_FINISHED");
});

test("sends error text for invalid render_ui", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("render-ui-bad-json"))));
  expect(list.some((e) => e.type === "ACTIVITY_SNAPSHOT")).toBe(false);
  expect(text(list)).toMatch(/wrong format/);
  expect(list.at(-1)?.type).toBe("RUN_FINISHED");
});

test("rewrites activity messages for the model", async () => {
  const surface = { surfaceId: "contact", components: [{ id: "root", component: "Text", text: "Hi" }] };
  const up = upstream(fixture("text"));
  await events(
    await handleAgent(
      request(
        input({
          messages: [
            { id: "u1", role: "user", content: "Show a card." },
            { id: "ui-1", role: "activity", activityType: "moa-ui", content: { messages: [{ version: "1.0", createSurface: surface }] } },
            { id: "u2", role: "user", content: "Change it." },
          ],
        }),
      ),
      up,
    ),
  );
  const messages = up.sent().messages;
  expect(messages[0].role).toBe("system");
  expect(messages.slice(1)).toEqual([
    { role: "user", content: "Show a card." },
    { role: "assistant", content: `이 화면을 보여 줌: ${JSON.stringify(surface)}` },
    { role: "user", content: "Change it." },
  ]);
});

test("passes moaAction as user input after validation", async () => {
  const action = { name: "signup", surfaceId: "signup", sourceComponentId: "submit", timestamp: "2026-11-22T00:00:00.000Z", context: { name: "Ada" } };
  const up = upstream(fixture("text"));
  await events(await handleAgent(request(input({ forwardedProps: { moaAction: { messageId: "ui-1", action } } })), up));
  const last = up.sent().messages.at(-1);
  expect(last.role).toBe("user");
  expect(last.content).toContain(JSON.stringify(action));

  const bad = upstream(fixture("text"));
  const res = await handleAgent(request(input({ forwardedProps: { moaAction: { messageId: "ui-1", action: { name: 1 } } } })), bad);
  expect(res.status).toBe(400);
  expect(bad.calls).toHaveLength(0);
});

test("uses the requested model or the default", async () => {
  const up = upstream(fixture("text"));
  await events(await handleAgent(request(input()), up));
  expect(up.sent().model).toBe(DEFAULT_MODEL);

  const picked = upstream(fixture("text"));
  await events(await handleAgent(request(input({ forwardedProps: { model: "google/gemma-4-31b-it:free" } })), picked));
  expect(picked.sent().model).toBe("google/gemma-4-31b-it:free");
});

test("rejects malformed model names with 400", async () => {
  const up = upstream(fixture("text"));
  for (const model of ["gpt", "openai/GPT 5", `a/${"b".repeat(100)}`, "evil/<script>", 42]) {
    expect((await handleAgent(request(input({ forwardedProps: { model } })), up)).status).toBe(400);
  }
  expect(up.calls).toHaveLength(0);
});

test("tells the user when the model does not call render_ui", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("text"))));
  expect(text(list)).toMatch(/did not call render_ui/);
});

test("passes upstream 429 limit_source as RUN_ERROR code", async () => {
  const body = JSON.stringify({ error: { code: 429, message: "Rate limited", metadata: { limit_source: "upstream_provider_shared_pool" } } });
  const res = await handleAgent(request(input()), upstream(body, { status: 429, headers: { "Content-Type": "application/json" } }));
  expect(res.status).toBe(200);
  const list = await events(res);
  expect(list.at(-1)).toMatchObject({ type: "RUN_ERROR", code: "upstream_provider_shared_pool" });
});

test("ends with RUN_ERROR when the upstream stream is cut off", async () => {
  const list = await events(await handleAgent(request(input()), upstream(fixture("truncated"))));
  expect(list.some((e) => e.type === "ACTIVITY_SNAPSHOT")).toBe(false);
  expect(list.at(-1)).toMatchObject({ type: "RUN_ERROR" });
});

test("calls only the OpenRouter endpoint", async () => {
  const up = upstream(fixture("render-ui"));
  await events(await handleAgent(request(input()), up));
  expect(up.calls.map((c) => c.url)).toEqual([OPENROUTER]);
  expect(new Headers(up.calls[0]?.init.headers).get("Authorization")).toBe(`Bearer ${KEY}`);
  expect(up.sent()).toMatchObject({ stream: true, tools: [expect.objectContaining({ function: expect.objectContaining({ name: "render_ui" }) })] });
});

test("never logs or returns the key", async () => {
  const logged: unknown[] = [];
  const spies = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
    vi.spyOn(console, m).mockImplementation((...args: unknown[]) => void logged.push(...args)),
  );
  try {
    const leak = JSON.stringify({ error: { message: `Invalid key ${KEY}` } });
    const failing = [
      upstream(leak, { status: 401, headers: { "Content-Type": "application/json" } }),
      upstream(leak, { status: 500 }),
      upstream(`data: {"error":{"message":"bad key ${KEY}"}}\n\n`),
      {
        fetch: (async () => {
          throw new Error(`network failed for ${KEY}`);
        }) as typeof globalThis.fetch,
      },
    ];
    for (const up of failing) {
      const res = await handleAgent(request(input()), up);
      const body = await res.text();
      expect(body).not.toContain(KEY);
      expect(JSON.stringify([...res.headers])).not.toContain(KEY);
    }
    const rejected = await handleAgent(request(input({ forwardedProps: { model: KEY } })), upstream(""));
    expect(await rejected.text()).not.toContain(KEY);
    expect(JSON.stringify(logged)).not.toContain(KEY);
  } finally {
    for (const s of spies) s.mockRestore();
  }
});
