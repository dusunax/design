[English](https://github.com/dusunax/design/blob/main/packages/moa-stream/README.md) | 한국어

# @dusunax/moa-stream

에이전트 이벤트 스트림을 UI 상태로 바꾸는 React hook이다. [AG-UI](https://docs.ag-ui.com) 이벤트를 읽어 `messages`, `toolCalls`, `runStatus`, 공유 `state`를 갱신한다. `@ag-ui/core`에서는 타입과 이벤트 이름만 가져온다.

## 설치

```bash
pnpm add @dusunax/moa-stream
```

React 19가 필요하다(`react`는 peer dependency).

## 사용

`run`은 이벤트의 `AsyncIterable`이면 무엇이든 받는다. `text/event-stream`으로 응답하는 서버라면 `sseEvents`가 그것을 만든다.

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

- 사용자 메시지는 `run`의 둘째 인자로 넘긴다. 서버는 사용자 메시지를 이벤트로 돌려주지 않아서, 이렇게 해야 `messages`에 남는다.
- 실행 중에 `run`을 다시 부르면 이전 실행을 멈춘다. `abort`는 실행을 멈추고 `runStatus`를 `idle`로 돌린다.
- 상태 이름은 moa `RunStatus`·`ToolCallCard` props와 같아서 그대로 넘길 수 있다.
- `sseEvents`는 POST로 요청한다. 둘째 인자에 `signal`을 넘기면 요청까지 끊는다.

### 다른 이벤트 출처

이벤트를 내보내기만 하면 된다. 테스트나 스토리에서 녹화한 이벤트를 재생하는 예:

```ts
async function* replay(events) {
  for (const event of events) yield event;
}

run(replay(recordedEvents));
```

공식 `@ag-ui/client`를 쓰려면 앱에서 `Observable`을 `AsyncIterable`로 바꿔 `run`에 넘긴다. 이 변환은 패키지에 없다.

## 다루는 이벤트

| 이벤트 | 상태 |
|---|---|
| `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR` | `runStatus`, `error` |
| `TEXT_MESSAGE_START`, `_CONTENT`, `_END` | `messages` |
| `TOOL_CALL_START`, `_ARGS`, `_END`, `_RESULT` | `toolCalls` |
| `STATE_SNAPSHOT`, `STATE_DELTA` | `state` |
| `ACTIVITY_SNAPSHOT`, `ACTIVITY_DELTA` | role `activity` 메시지 |

그 밖의 이벤트는 무시한다. 상태를 직접 관리하려면 순수 함수 `reduceEvent(state, event)`를 쓴다.

## 보안

`STATE_DELTA`·`ACTIVITY_DELTA`의 패치는 에이전트가 보낸다. JSON Patch는 제한적으로만 적용한다.

- `add`와 `replace`만 적용한다.
- 경로에 `__proto__`, `constructor`, `prototype`이 있으면 패치 전체를 거부한다.
- 거부한 패치는 상태를 바꾸지 않고 `error.code`를 `PATCH_REJECTED`로 둔다.

## 라이선스

MIT
