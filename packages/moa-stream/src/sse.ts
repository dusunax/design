import { type BaseEvent, EventType } from "@ag-ui/core";

const runError = (message: string, code: string): BaseEvent =>
  ({ type: EventType.RUN_ERROR, message, code }) as BaseEvent;

/** text/event-stream 본문을 이벤트로 바꾼다. data: 줄만 읽고, JSON이 아니면 RUN_ERROR 하나를 내고 멈춘다. */
export async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<BaseEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      // \r\n이 청크 경계에서 갈려도 합친 뒤에 바꾼다.
      buffer = (buffer + decoder.decode(value, { stream: !done })).replaceAll("\r\n", "\n");
      let end = buffer.indexOf("\n\n");
      while (end >= 0) {
        const block = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(line.startsWith("data: ") ? 6 : 5))
          .join("\n");
        if (data) {
          try {
            yield JSON.parse(data) as BaseEvent;
          } catch {
            yield runError("Malformed event", "BAD_EVENT");
            return;
          }
        }
        end = buffer.indexOf("\n\n");
      }
      if (done) return;
    }
  } finally {
    reader.releaseLock();
  }
}

/** POST로 요청하고 응답을 이벤트로 읽는다. HTTP 오류는 RUN_ERROR 하나로 바꾼다. 중단은 init.signal로 한다. */
export async function* sseEvents(url: string, init?: RequestInit): AsyncGenerator<BaseEvent> {
  const res = await fetch(url, { method: "POST", ...init });
  if (!res.ok || !res.body) {
    yield runError(`HTTP ${res.status}`, String(res.status));
    return;
  }
  yield* parseSse(res.body);
}
