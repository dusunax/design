English | [한국어](https://github.com/dusunax/design/blob/main/packages/moa-stream/README.ko.md)

# @dusunax/moa-stream

A React hook that turns an agent event stream into UI state. It reads [AG-UI](https://docs.ag-ui.com) events and keeps `messages`, `toolCalls`, `runStatus`, and shared `state` up to date. It depends only on the types and event names from `@ag-ui/core`.

## Install

```bash
pnpm add @dusunax/moa-stream
```

Requires React 19 (`react` is a peer dependency).

## Usage

`run` takes any `AsyncIterable` of events. `sseEvents` gives you one from a server that answers with `text/event-stream`.

```tsx
import { sseEvents, useAgentStream } from "@dusunax/moa-stream";

export function Chat() {
  const { state, run } = useAgentStream();

  const send = (text: string) => {
    const user = { id: crypto.randomUUID(), role: "user" as const, content: text };
    void run(
      sseEvents("/api/agent", { body: JSON.stringify({ messages: [...state.messages, user] }) }),
      [user],
    );
  };

  return <p>{state.runStatus}</p>;
}
```

- Pass the user's message as the second argument of `run`. Servers don't echo it back as an event, so this is how it shows up in `messages`.
- Calling `run` while a run is in progress stops the previous one. `abort` stops it and sets `runStatus` back to `idle`.
- Status names match the moa `RunStatus` and `ToolCallCard` props, so you can pass them straight through.
- `sseEvents` sends a POST request. Pass `signal` in the second argument to cancel the request too.

### Other event sources

Anything that produces events works, such as recorded events in a test or a story:

```ts
async function* replay(events) {
  for (const event of events) yield event;
}

run(replay(recordedEvents));
```

To use the official `@ag-ui/client`, turn its `Observable` into an `AsyncIterable` in your app and pass that to `run`. This package doesn't include that adapter.

## What it handles

| Events | State |
|---|---|
| `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR` | `runStatus`, `error` |
| `TEXT_MESSAGE_START`, `_CONTENT`, `_END` | `messages` |
| `TOOL_CALL_START`, `_ARGS`, `_END`, `_RESULT` | `toolCalls` |
| `STATE_SNAPSHOT`, `STATE_DELTA` | `state` |
| `ACTIVITY_SNAPSHOT`, `ACTIVITY_DELTA` | `messages` with role `activity` |

Other events are ignored. `reduceEvent(state, event)` is exported as a pure function if you want to manage state yourself.

## Security

Patches in `STATE_DELTA` and `ACTIVITY_DELTA` come from the agent. The JSON Patch support is limited:

- Only `add` and `replace` are applied.
- A patch whose path contains `__proto__`, `constructor`, or `prototype` is rejected as a whole.
- A rejected patch leaves the state unchanged and sets `error.code` to `PATCH_REJECTED`.

## License

MIT
