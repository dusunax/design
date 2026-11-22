[English](https://github.com/dusunax/design/blob/main/packages/moa-render/README.md) | 한국어

# @dusunax/moa-render

에이전트가 보낸 UI 명세를 [moa](https://www.npmjs.com/package/@dusunax/moa) 부품으로 그린다. A2UI 라이브러리 없이 [A2UI](https://a2ui.org) v1.0 메시지의 일부를 직접 해석한다.

## 설치

```bash
pnpm add @dusunax/moa-render @dusunax/moa
```

React 19가 필요하다. `@dusunax/moa`, `react`, `react-dom`은 peer dependency다. 앱에서 moa 스타일을 한 번 불러온다.

## 사용

```tsx
import "@dusunax/moa/styles.css";
import { MoaSurfaces } from "@dusunax/moa-render";

<MoaSurfaces
  messages={a2uiMessages}
  onAction={(action) => sendToAgent(action)}
  onError={(error) => console.warn(error.code, error.message)}
/>;
```

- `messages`는 A2UI v1.0 메시지 배열이다. `@dusunax/moa-stream`과 함께 쓰면 `activityType`이 `"moa-ui"`인 `activity` 메시지의 `content.messages`를 넘긴다.
- `onAction`은 A2UI v1.0 `action` 메시지와 같은 모양을 받고, `context`의 path는 값으로 채워져 있다.
- 사용자가 입력한 값은 데이터 모델 위에 덮어 둔다. 사용자가 바꾼 path는 에이전트가 새 값을 보내도 사용자 값이 보인다.

### 서버에서 검사

`@dusunax/moa-render/core`는 React를 import하지 않는다. 서버에서 렌더러와 같은 규칙으로 명세를 검사할 때 쓴다.

```ts
import { checkSurfaces, toSurfaces } from "@dusunax/moa-render/core";

const { surfaces, errors } = toSurfaces(messages);
const problems = [...errors, ...checkSurfaces(surfaces)]; // root, 없는 id, 깊이, 부품 수
```

## 지원 범위

| A2UI | 지원 |
|---|---|
| 메시지 | `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface` |
| 부품 | Text, Image, Icon, Row, Column, List, Card, Divider, Button, TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Modal, Tabs |
| 값 | 리터럴과 `{ "path": "/pointer" }` 바인딩. path에 묶인 입력 값은 양방향 |
| action | Button `action.event` |

지원하지 않는 것: 함수 호출, `checks`, `children` 템플릿, `sendDataModel`, Video, AudioPlayer. 지원하지 않는 부분은 빈자리로 두고 `onError`로 알린다.

## 보안

명세는 모델이 만들고, 모델은 프롬프트 인젝션으로 조종될 수 있다. 그래서 기본값을 엄격하게 둔다.

| 기본값 | 바꾸는 방법 |
|---|---|
| 이미지를 불러오지 않아 페이지 밖으로 요청이 나가지 않음 | `isAllowedUrl(url, "image")`. `https:` 주소만 이 함수까지 옴 |
| 링크 글자 뒤에 실제 도메인을 보여 줌: `문서 (example.com)` | `isAllowedUrl(url, "link")`가 `false`면 링크 대신 평문 |
| `obscured` TextField와 Modal을 그리지 않음 | `allowSensitive` |

항상 적용:

- A2UI catalog에 있는 prop만 moa 부품에 넘긴다. `style`, `className`, `dangerouslySetInnerHTML`, `on*` 같은 키는 버린다.
- 문자열은 텍스트로만 그리고 HTML로 해석하지 않는다.
- 데이터 모델 경로에 `__proto__`, `constructor`, `prototype`이 있으면 거부한다.
- 트리 깊이는 32, surface 하나에서 그리는 부품 수는 500으로 제한한다.

막지 못하는 것: "비밀번호를 입력하세요"라고 적힌 일반 TextField는 다른 입력란과 구분되지 않는다. 신뢰할 수 없는 내용이 에이전트 입력에 들어갈 수 있다면, 카드가 모델이 만든 것이라는 점을 사용자에게 알린다.

## 라이선스

MIT
