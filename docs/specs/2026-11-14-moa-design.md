---
id: DOC-5
type: spec
title: moa 디자인 시스템 설계
description: >
  AG-UI PoC를 지원하는 경량 부품 디자인 시스템 moa의 목적, 패키지 구성, 스타일링, 부품, 빌드·배포 결정과 그 근거를 정한다.
  무엇을 왜 만드는지 알고 싶을 때, 플랜의 결정 근거를 확인할 때 읽는다.
---

# moa 디자인 시스템 설계

## 목적

`dusunax/design` 레포를 재구성해 AG-UI PoC를 지원하는 **경량 부품 디자인 시스템 moa**를 만든다. moa는 한국어 "모아"로, 부품을 모아 화면을 조립한다는 뜻이다.

목표는 세 가지다.

1. 기존 레포를 정리한다.
2. 최소한의 부품만 가진 디자인 시스템을 만든다.
3. AG-UI PoC를 지원한다.

판단 기준은 **번들 크기와 의존성을 최소로 유지하는 것**이다.

## 패키지 구성

pnpm workspace 모노레포로 구성한다. 루트에는 workspace 설정만 둔다.

| 경로 | 패키지 | 배포 | 역할 | 작업 ID |
|---|---|---|---|---|
| `packages/moa` | `@dusunax/moa` | npm | 프레젠테이션 부품. 프로토콜을 모른다 | MOA-1\~MOA-7 |
| `packages/storybook` | `@dusunax/moa-storybook` | private | 문서, Chromatic | MOA-1\~MOA-6 |
| `packages/moa-render` | `@dusunax/moa-render` | npm | 에이전트가 보낸 UI 명세 → moa 부품 렌더러 | DOC-7, DOC-8에서 정한다 |
| `packages/moa-stream` | `@dusunax/moa-stream` | npm | 에이전트 이벤트 스트림(AG-UI) → UI 상태 훅 | DOC-7, DOC-8에서 정한다 |
| `apps/playground` | — | private | 실제 에이전트를 연결하는 PoC | DOC-7, DOC-8에서 정한다 |

`moa-render`, `moa-stream`, playground는 DOC-7(스펙)과 DOC-8(플랜)에서 자세히 정한다. 그때 다룰 입력은 다음과 같다: `moa-stream`은 `@ag-ui/client@1.0.4` 기반 훅과 이벤트 fixture 재생 스토리, playground는 OpenRouter `:free` 모델만 쓴다. 작업 순서와 상태는 DOC-3에 있다.

**이름 규칙**

- 패키지 이름에 "A2UI", "AG-UI"를 쓰지 않는다. 공식 구현으로 오해받지 않기 위해서다. 호환 대상은 README 설명에만 적는다.
- `@dusunax/` 스코프 아래 범용 이름(`agent` 등)은 다른 프로젝트를 위해 비워 둔다. 이 시스템의 패키지는 모두 `moa` 접두사를 쓴다.

### 패키지 경계

`moa-render`와 `moa-stream`은 다루는 축이 다르다. `moa-stream`은 에이전트와 통신하는 방식을 다루고, `moa-render`는 화면에 무엇을 그릴지를 다룬다.

| | `moa-stream` | `moa-render` |
|---|---|---|
| 입력 | AG-UI 이벤트 (`RUN_*`, `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_*`) | UI 명세 (id로 서로 참조하는 부품 목록, 데이터 모델, action) |
| 출력 | 상태: `messages`, `toolCalls`, `runStatus`, `state` | moa 부품 트리 |
| 아는 것 | AG-UI 프로토콜, 전송 | moa catalog, 명세 형식 |
| 모르는 것 | 화면 구성 | 명세가 어떤 경로로 왔는지 |
| 핵심 | `events → state` reducer와 이를 감싼 훅 | `spec → tree` 순수 함수와 이를 감싼 컴포넌트 |

**데이터 흐름**

```
에이전트 ─AG-UI 이벤트→ moa-stream ─messages·toolCalls·runStatus→ MessageBubble, StreamingText, RunStatus, ToolCallCard
                          │
                          └─state.ui→ moa-render ─→ Row, Card, Button, TextField …
                                          │
              moa-stream이 에이전트로 전송 ←─onAction
```

**규칙**

- 두 패키지는 서로 의존하지 않는다. 둘을 연결하는 일은 쓰는 쪽 앱(`apps/playground`)이 한다.
- `moa`는 두 패키지 어느 쪽도 모른다. 공개 API에 AG-UI 타입이나 명세 타입을 노출하지 않는다.
- `moa-render`는 `moa`에만 의존한다. `moa-stream`은 `@ag-ui/client`에 의존하고 `moa`에는 의존하지 않는다.

**나누는 이유**

1. 따로 쓰는 경우가 있다. 채팅만 필요하면 `moa-stream`만 쓴다. UI 명세가 MCP 도구 결과, 서버 API, 고정 JSON처럼 AG-UI가 아닌 경로로 오면 `moa-render`만 쓴다.
2. 의존성 크기가 다르다. `@ag-ui/client`와 그 의존성을 명세만 그리는 쪽에 강제하지 않는다.
3. 변경 원인이 다르다. `moa-stream`은 AG-UI 스펙이 바뀔 때, `moa-render`는 명세 형식이나 catalog가 바뀔 때 고친다. 버전도 따로 올린다.
4. 테스트가 단순하다. 이벤트 배열 → 상태, 명세 → DOM을 각각 네트워크 mock 없이 검증한다.

## 기존 레포 정리

multi-touch 예제, Next.js 설정, 쓰지 않는 의존성은 제거한다. 마지막 상태는 `legacy/multi-touch` 태그로 남긴다.

## 스타일링

- 개발은 Tailwind CSS v4로 한다. `prefix(moa)`를 적용해 유틸리티는 `moa:flex`, 테마 변수는 `--moa-*` 형태가 된다.
- 배포 결과물은 **컴파일된 플레인 CSS 파일 하나**(`@dusunax/moa/styles.css`)다. 사용하는 쪽에 Tailwind가 필요 없다.
- Tailwind preflight(전역 리셋)는 배포 CSS에 넣지 않는다. 사용하는 쪽 페이지를 바꾸면 안 되기 때문이다.
- 토큰은 `@theme`에서 정의한다. 다크 모드는 `[data-moa-theme="dark"]` 셀렉터로 변수를 덮어쓴다.
- `tailwind-merge`는 쓰지 않는다(크기). 클래스 결합은 `clsx`, 변형은 `class-variance-authority`로 한다.

## 브랜드 컨셉

마스코트는 새싹이 난 청록 슬라임이다. 작은 부품이 모여 화면이 자란다는 뜻을 담는다.

- 16×16 격자 원본: [`moa-mascot-16.svg`](../assets/moa-mascot-16.svg) (32px 이하)
- 32×32 격자 원본: [`moa-mascot-32.svg`](../assets/moa-mascot-32.svg) (32px 초과)
- 쓰는 곳: 로고, 파비콘, 빈 상태 그림 (부품 문구·스토리·문서 문장 제외)

## 부품

### A2UI 철학 차용

A2UI v1.0 basic catalog를 직접 구현하지 않고, 철학만 가져온다.

1. 허용 목록(catalog): 에이전트는 등록된 부품만 그린다.
2. 평평한 목록 + id 참조: 조각 단위로 스트리밍하고 업데이트한다. (`moa-render`에서 다룬다)
3. 구조와 데이터 모델 분리: 값은 경로로 바인딩한다. (`moa-render`에서 다룬다)
4. 스타일이 아닌 의미 힌트: `variant`로 무엇인지만 전달한다.
5. Action은 에이전트로 돌아가는 이벤트다.

`moa`의 **부품 이름, prop 이름, variant 값은 catalog와 같게 맞춘다.** 나중에 `moa-render`에서 1:1로 매핑하기 위해서다. 기본값은 다를 수 있다(Image `fit`은 catalog `fill`, moa `cover`). 이때 `moa-render`는 명세에 값이 없으면 catalog 기본값을 직접 넘긴다. 공개 API는 React 관례를 따른다(`children`, `onChange`, `onClick`).

### 직접 구현 (네이티브 요소)

Text, Image, Icon, Row, Column, List, Card, Divider, Button, TextField, CheckBox, DateTimeInput

- Text는 간단한 Markdown(굵게, 기울임, 인라인 코드, 링크, 줄바꿈)만 지원한다. HTML은 렌더링하지 않는다.
- CheckBox는 네이티브 checkbox에 `appearance: none`을 적용해 만든다.
- DateTimeInput은 네이티브 `date`/`time`/`datetime-local` 입력을 쓴다.
- Icon은 catalog에 있는 59개 이름에 대한 SVG path만 패키지에 넣는다. 출처는 Material Symbols(Apache-2.0)다. `{ svgPath }` 형태의 커스텀 아이콘도 받는다.
- Video, AudioPlayer는 MOA-1\~MOA-6 범위에서 제외한다.

### Radix 래핑

| 부품 | Radix 패키지 |
|---|---|
| Modal | `@radix-ui/react-dialog` |
| Tabs | `@radix-ui/react-tabs` |
| Slider | `@radix-ui/react-slider` |
| ChoicePicker (단일 선택 + `checkbox`) | `@radix-ui/react-radio-group` |
| ChoicePicker (`chips`) | `@radix-ui/react-toggle-group` |

- Radix를 쓰는 이유: 같은 5개 부품의 실측 크기가 Radix 36.2KB, Base UI 1.9.0 60.8KB(gzip)다.
- Radix 타입과 prop은 공개 API에 노출하지 않는다. 나중에 교체할 수 있게 하기 위해서다.
- ChoicePicker의 `multipleSelection` + `checkbox` 조합은 moa CheckBox로 만든다. `filterable`은 검색 input으로 직접 구현한다.

### 에이전트 전용 부품

catalog에는 없지만 AG-UI 이벤트를 화면에 보여 주려면 필요하다.

| 부품 | 역할 | 구현 |
|---|---|---|
| MessageBubble | 사용자·에이전트 메시지 | 직접 |
| StreamingText | 토큰이 이어 붙는 텍스트, 커서 표시 | 직접 |
| RunStatus | 실행 상태(대기·실행 중·완료·오류) | 직접 |
| ToolCallCard | 도구 이름, 인자, 결과, 상태 | 네이티브 `<details>` |

## 빌드와 배포

- 빌드: `tsdown`으로 ESM과 `.d.ts`를 만든다. 부품마다 subpath export(`@dusunax/moa/button`)를 둔다.
- 타입 선언은 `isolatedDeclarations`로 생성한다. TypeScript 7 API에 의존하지 않기 위해서다.
- 버전 관리와 npm 배포는 changesets로 한다.
- size-limit은 **리포트 모드**(경고만, CI 실패 없음)로 둔다.

| 대상 | 예산 (gzip) |
|---|---|
| 직접 구현 부품 전체 JS | 5KB |
| 전체 JS | 40KB |
| Radix 래핑 부품 하나 | 15KB |
| `styles.css` | 10KB |

## Storybook과 Chromatic

- Storybook 10 + `@storybook/react-vite`
- light/dark 전환은 툴바로 한다.
- 문서는 한국어가 기본이고 영어를 함께 둔다. Storybook은 언어별로 따로 빌드한다(한국어 `/`, 영어 `/en/`). 번역은 설명 문구만 하고, 스토리 이름과 prop 이름은 영어로 둔다. README도 `README.md`(한국어)와 `README.en.md`(영어)를 짝으로 둔다. 영어 지원은 MOA-6에서 한 번에 한다.
- 부품 UI 기본 문구는 영어다. `moa`에 번역 사전을 넣지 않고, 문구 prop으로 바꾼다.
- Chromatic 배포는 MOA-5에서 설정한다.
