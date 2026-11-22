import type { BaseEvent } from "@ag-ui/core";
import { parseSse, sseEvents } from "./sse";

const streamOf = (chunks: string[]): ReadableStream<Uint8Array> => {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const chunk of chunks) c.enqueue(enc.encode(chunk));
      c.close();
    },
  });
};
const collect = async (it: AsyncIterable<BaseEvent>): Promise<BaseEvent[]> => {
  const out: BaseEvent[] = [];
  for await (const e of it) out.push(e);
  return out;
};

test("parses SSE data lines", async () => {
  const events = await collect(parseSse(streamOf([
    'data: {"type":"RUN_STARTED","threadId":"t","runId":"r"}\n\n',
    ": keep-alive\n\n",
    'event: message\ndata: {"type":"RUN_FINISHED","threadId":"t","runId":"r"}\n\n',
  ])));
  expect(events.map((e) => e.type)).toEqual(["RUN_STARTED", "RUN_FINISHED"]);
});

test("joins events split across chunks", async () => {
  const events = await collect(parseSse(streamOf([
    'data: {"type":"TEXT_MESSAGE_CON',
    'TENT","messageId":"m1",',
    '"delta":"hi"}\r\n\r',
    '\ndata: {"type":"RUN_FINISHED","threadId":"t","runId":"r"}\n\n',
  ])));
  expect(events).toEqual([
    { type: "TEXT_MESSAGE_CONTENT", messageId: "m1", delta: "hi" },
    { type: "RUN_FINISHED", threadId: "t", runId: "r" },
  ]);
});

test("turns malformed data into RUN_ERROR", async () => {
  const events = await collect(parseSse(streamOf(["data: {nope\n\n", 'data: {"type":"RUN_FINISHED"}\n\n'])));
  expect(events).toEqual([{ type: "RUN_ERROR", message: "Malformed event", code: "BAD_EVENT" }]);
});

test("turns HTTP errors into RUN_ERROR", async () => {
  const fetchMock = vi.fn(async () => new Response("nope", { status: 429 }));
  vi.stubGlobal("fetch", fetchMock);
  try {
    const events = await collect(sseEvents("/api/agent", { body: "{}" }));
    expect(events).toEqual([{ type: "RUN_ERROR", message: "HTTP 429", code: "429" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/agent", expect.objectContaining({ method: "POST", body: "{}" }));
  } finally {
    vi.unstubAllGlobals();
  }
});
