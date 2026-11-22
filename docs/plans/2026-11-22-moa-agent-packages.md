---
id: DOC-8
type: plan
title: 에이전트 연결 패키지 Implementation Plan
description: >
  MOA-8~MOA-11의 Step(할 일, 파일, 인터페이스, 검증 명령)을 ID별로 정한다.
  MOA-8~MOA-11을 진행하면서 다음 Step을 확인할 때 읽는다.
---

# 에이전트 연결 패키지 Implementation Plan

근거: DOC-7 (스펙), DOC-9\~DOC-13 (결정). 순서와 상태는 DOC-3, 진행 절차·게이트·Step 번호·커밋과 PR 규칙은 DOC-4에 있다.

**Goal:** `@dusunax/moa-stream`과 `@dusunax/moa-render`를 만들어 npm에 배포하고, 둘을 쓰는 `apps/playground`를 Vercel에 공개한다.

**Tech Stack:** DOC-6과 같다(pnpm 12.18, Node 24, React 19, TypeScript 7.0, tsdown, Vitest + Testing Library + jsdom, size-limit, changesets). 추가 런타임 의존은 `@ag-ui/core@1.0.4` 하나다. playground는 Vite와 Vercel Function을 쓴다. 버전은 각 ID의 첫 Step에서 `packages/moa/package.json`과 맞추고, 새로 받는 것은 3일 규칙을 따른다.

## Global Constraints

- DOC-6 Global Constraints 중 패키지 공통 규칙(`engines`, `packageManager`, `isolatedDeclarations`, `saveExact`·`minimumReleaseAge`, 공개 환경 변수 금지, 문서 문체, 스토리 규칙)을 그대로 따른다.
- 런타임 dependency 허용 목록
  - `moa-stream`: `@ag-ui/core@1.0.4`
  - `moa-render`: 없음. `@dusunax/moa`, `react`, `react-dom`은 peerDependency
  - 그 밖의 런타임 의존성은 추가하지 않는다.
- `moa-stream`과 `moa-render`는 서로 import하지 않는다. JSON Pointer 처리는 두 패키지에 각각 둔다. 몇십 줄이라 공유 패키지를 만드는 것보다 싸다.
- `@ag-ui/core`는 기본 진입점에서 타입과 `EventType`만 가져온다. `@ag-ui/core/schemas`(zod)는 import하지 않는다.
- 상한값
  - 트리 깊이 32, surface 하나의 부품 500개 (`moa-render`)
  - 요청 본문 256KB, `messages` 100개, `render_ui` 인자 64KB, `moaAction` 4KB (playground 서버)
- 방문자 키는 어떤 로그, 오류 메시지, 응답 본문에도 넣지 않는다. 서버의 `catch`는 고정된 문구만 돌려준다.
- private 패키지 `@dusunax/moa-fixtures`와 `apps/playground`는 배포하지 않는다. playground의 런타임 의존은 `react`, `react-dom`, workspace 패키지 넷, `@vercel/analytics`다.
- 실제 OpenRouter 키를 쓰는 확인은 사용자가 한다. 에이전트는 fixture와 mock으로만 확인한다.
- 패키지 README는 영어 `README.md`와 한국어 `README.ko.md` 두 벌이고 서로 링크한다.
- size-limit 예산(gzip, react·`moa` 제외): `moa-stream` 4KB, `moa-render` 6KB. 리포트 모드다.

## Review Focus

1. **JSON Patch·데이터 모델 경로에 `__proto__`가 들어오는 경우**: 패치 전체를 적용하지 않고 `Object.prototype`이 바뀌지 않아야 한다. → MOA-8 `rejects prototype paths`, MOA-9 `blocks prototype paths in data model`
2. **SSE 이벤트 하나가 여러 청크로 나뉘어 오는 경우**: 줄 중간에서 끊겨도 이벤트가 한 번만, 온전하게 나와야 한다. → MOA-8 `joins events split across chunks`
3. **모델이 외부 이미지 URL을 넣는 경우**: 기본 설정에서 이미지 요청이 나가지 않아야 한다. → MOA-9 `does not render images by default`
4. **링크 글자와 실제 주소가 다른 경우**: 실제 도메인이 글자 옆에 보여야 한다. → MOA-9 `appends link domain`
5. **모델이 비밀번호 입력란이나 Modal을 그리는 경우**: 기본 설정에서 그리지 않아야 한다. → MOA-9 `blocks sensitive components by default`
6. **id 참조가 순환하는 경우**: 무한 재귀 없이 깊이 상한에서 멈춰야 한다. → MOA-9 `stops cyclic references at depth limit`
7. **서버 오류에 방문자 키가 섞이는 경우**: 로그와 응답 어디에도 키 문자열이 없어야 한다. → MOA-10 `never logs or returns the key`
8. **`render_ui` 인자의 형식이 틀린 경우**: 서버가 죽지 않고 오류 텍스트 메시지를 보내야 한다. → MOA-10 `sends error text for invalid render_ui`
9. **명세에 `dangerouslySetInnerHTML`·`style`·`props` 같은 목록 밖 키가 있는 경우**: moa 부품에 넘어가지 않아야 한다. 모델은 공격이 없어도 `props` 객체를 넣는다. → MOA-9 `passes only catalog props`, `drops dangerouslySetInnerHTML, style, className and event props`

---

## File Structure

```
pnpm-workspace.yaml                 apps/* 추가 (MOA-10)
packages/moa-fixtures/              private, 배포하지 않음 (MOA-8)
  package.json
  src/index.ts                      replay(events, delayMs), 이벤트 JSON re-export
  events/chat.json                  텍스트 스트리밍
  events/tool-call.json             도구 호출과 결과
  events/ui-card.json               ACTIVITY_SNAPSHOT·DELTA, 카드 두 개
  events/bad-patch.json             차단 경로와 지원하지 않는 op
packages/moa-stream/
  package.json · tsconfig.json · tsdown.config.ts · vitest.config.ts · .size-limit.json
  README.md · README.ko.md
  src/index.ts
  src/types.ts                      StreamState, ToolCallState
  src/json-patch.ts                 add·replace, 경로 차단
  src/reduce.ts                     initialState, reduceEvent
  src/sse.ts                        parseSse, sseEvents
  src/use-agent-stream.ts           useAgentStream
  src/*.test.ts(x)
packages/moa-render/
  package.json · tsconfig.json · tsdown.config.ts · vitest.config.ts · vitest.setup.ts · .size-limit.json
  README.md · README.ko.md
  src/index.ts                      공개 경로 `.`: MoaSurfaces
  src/core.ts                       공개 경로 `./core`: toSurfaces, checkSurfaces, 타입 (React 없음)
  src/types.ts                      A2uiMessage, Surface, MoaAction, MoaRenderError
  src/pointer.ts                    JSON Pointer 읽기·쓰기, 경로 차단
  src/surfaces.ts                   toSurfaces, checkSurfaces
  src/catalog.ts                    부품별 prop 허용 목록, 기본값, 이름 바꾸기, 민감 부품 판정 (SEC-3.9)
  src/bind.ts                       값 읽기, 입력 값 쓰기, action context 채우기
  src/links.ts                      링크 도메인 붙이기
  src/MoaSurfaces.tsx               트리 그리기
  src/*.test.ts(x)
packages/storybook/stories/
  Surfaces.stories.tsx              Render/Surfaces
  AgentChat.stories.tsx             Agent/Chat (fixture)
apps/playground/
  package.json · tsconfig.json · vite.config.ts · index.html · vercel.json (CSP)
  api/agent.ts                      Vercel Function 진입점
  server/handler.ts                 handleAgent(request, deps)
  server/openrouter.ts              OpenRouter 스트림 → AG-UI 이벤트
  server/validate.ts                RunAgentInput·모델 이름·moaAction 검증. A2UI 검증은 moa-render/core
  server/model.ts                   추천 모델, 모델 이름 형식 검사
  server/prompt.ts                  시스템 프롬프트와 render_ui 도구 정의
  server/dev-plugin.ts              Vite 개발 서버에 handleAgent 붙이기
  server/*.test.ts
  server/fixtures/*.txt             OpenRouter SSE 응답 녹화본
  scripts/eval-models.mjs           모델 평가 (사용자가 실행)
  src/main.tsx · src/App.tsx
  src/KeyInput.tsx · src/ModelPicker.tsx
```

`moa-render`의 허용 목록은 `catalog.ts` 한 곳에만 둔다. 보안 점검(SEC-4)에서 이 파일과 테스트만 보면 되게 하기 위해서다.

---

## MOA-8 moa-stream

- 브랜치 `MOA-8` · PR `feat(moa-stream): [MOA-8] 에이전트 이벤트 스트림 hook 추가`

### 게이트

- [x] **MOA-8.0: 게이트를 확인한다** — SEC-3. DOC-4의 게이트 확인을 따른다. SEC-3에서 나온 수정 Step은 `MOA-8.0a`처럼 붙인다.

### 패키지 뼈대

- [x] **MOA-8.1: 패키지를 만든다**

  `packages/moa/`의 `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`를 본떠 `packages/moa-stream/`을 만든다. entry는 `src/index.ts` 하나다. `package.json`은 `version: "0.0.0"`, `files: ["dist", "README.ko.md"]`, `peerDependencies: { react: "^19" }`, `dependencies: { "@ag-ui/core": "1.0.4" }`다. devDependency 버전은 moa와 같게 둔다.

Run: `pnpm install && pnpm --filter @dusunax/moa-stream build`
Expected: `dist/index.js`와 `dist/index.d.ts`가 생긴다.

- [x] **MOA-8.2: fixture 패키지를 만든다** — `packages/moa-fixtures`를 `private: true`로 만들고 File Structure의 이벤트 네 파일과 `replay(events, delayMs)`를 둔다. 각 파일은 `BaseEvent[]` JSON이고 `ui-card.json`은 DOC-9 예시 모양을 따른다. `moa-stream`은 이 패키지를 devDependency(`workspace:*`)로만 쓴다.
- [x] **MOA-8.3: 커밋한다** — `chore: moa-stream 뼈대와 moa-fixtures 추가`

### reducer와 JSON Patch

**Interfaces:**
- Produces: `StreamState`, `ToolCallState`, `initialState: StreamState`, `reduceEvent(state, event): StreamState`, `applyPatch(doc, ops): { ok: true; value: unknown } | { ok: false; reason: string }` (패키지 안에서만 사용)
- DOC-7 "이벤트 처리"와 "JSON Patch"를 그대로 구현한다.

- [x] **MOA-8.4: 테스트를 작성한다**

  - `streams text messages`: `chat.json`을 다 넣으면 assistant 메시지 하나에 글자가 이어 붙고 `runStatus`가 `finished`
  - `tracks tool calls`: `tool-call.json` → `args`가 원문으로 이어지고 결과 뒤 `finished`
  - `joins text parts of tool results`: `content`가 파트 배열이면 text 파트만 이어 붙임
  - `marks unfinished tool calls as error on RUN_ERROR`
  - `creates and patches activity messages`: `ui-card.json` → activity 메시지 두 개, delta는 해당 카드에만
  - `keeps activity when replace is false`
  - `applies add and replace with array index and dash`
  - `rejects prototype paths`: 패치 전체를 버리고 `error`에 남기며 `({}).polluted`가 `undefined`
  - `rejects unsupported ops`
  - `ignores unknown events and ids`
  - `does not mutate previous state`

- [x] **MOA-8.5: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-8.6: 구현한다**
- [x] **MOA-8.7: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-8.8: 커밋한다** — `feat(moa-stream): 이벤트 reducer와 JSON Patch 추가`

### SSE와 hook

**Interfaces:**
- Produces: `sseEvents(url, init?): AsyncIterable<BaseEvent>`, `useAgentStream(): { state; run(source, newMessages?); abort() }`
- `sseEvents`는 `fetch(url, { method: "POST", ...init })`로 요청하고, `data:` 줄을 모아 빈 줄에서 `JSON.parse`한다. HTTP 오류는 `RUN_ERROR` 이벤트 하나로 바꿔 내보낸다.

- [x] **MOA-8.9: 테스트를 작성한다**

  - `parses SSE data lines`
  - `joins events split across chunks`: 한 이벤트를 세 청크로 나눠도 한 번만 나옴
  - `turns malformed data into RUN_ERROR`
  - `turns HTTP errors into RUN_ERROR`
  - `turns thrown errors into error state`
  - `run appends new messages before events`
  - `run aborts the previous run`
  - `abort returns to idle`

- [x] **MOA-8.10: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-8.11: 구현한다**
- [x] **MOA-8.12: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-8.13: 커밋한다** — `feat(moa-stream): SSE 파서와 useAgentStream 추가`

### 크기와 문서

- [x] **MOA-8.14: size-limit을 설정하고 잰다** — 예산 4KB. 넘으면 PR 리뷰 참고에 원인을 적는다.
- [x] **MOA-8.15: README 두 벌과 changeset을 쓴다** — 설치, `useAgentStream` 예시, 이벤트 배열을 async generator로 넣는 법, `@ag-ui/client`를 넣는 법. changeset은 `minor`(첫 배포 0.1.0).
- [x] **MOA-8.16: 커밋한다** — `docs(moa-stream): README와 크기 예산 추가`

---

## MOA-9 moa-render

- 브랜치 `MOA-9` · PR `feat(moa-render): [MOA-9] UI 명세 렌더러 추가`

### 게이트

- [x] **MOA-9.0: 게이트를 확인한다** — SEC-3.

### 패키지 뼈대

- [x] **MOA-9.1: 패키지를 만든다** — MOA-8.1과 같다. entry는 `src/index.ts`와 `src/core.ts` 두 개이고, `exports`에 `.`과 `./core`를 둔다. `peerDependencies: { "@dusunax/moa": "^0.1.1", react: "^19", "react-dom": "^19" }`, devDependency로 `@dusunax/moa: "workspace:*"`. 테스트 환경은 jsdom.

Run: `pnpm --filter @dusunax/moa-render build && grep -L react packages/moa-render/dist/core.js`
Expected: `core.js`가 출력된다. `core`에 React import가 없다는 뜻이다.
- [x] **MOA-9.2: 커밋한다** — `chore(moa-render): 패키지 뼈대 추가`

### surface 계산

**Interfaces:**
- Produces (`./core`): `A2uiMessage`, `Surface = { id: string; components: Map<string, A2uiComponent>; dataModel: unknown }`, `Surfaces = Surface[]`(만든 순서), `toSurfaces(messages): { surfaces: Surfaces; errors: MoaRenderError[] }`, `checkSurfaces(surfaces): MoaRenderError[]`
- DOC-7 "메시지"를 구현한다. 오류는 던지지 않고 `errors`에 모은다. `checkSurfaces`는 root, 없는 id 참조, 깊이·부품 수 상한을 본다. playground 서버도 이 둘로 검증한다.

- [x] **MOA-9.3: 테스트를 작성한다**

  - `creates surface with inline components and data`
  - `updates components by id`
  - `updates data model at path and at root`
  - `deletes surface`
  - `reports unsupported messages and versions`
  - `blocks prototype paths in data model`
  - `reports non-array input`
  - `checkSurfaces reports missing root and missing id references`
  - `checkSurfaces reports depth and component limits`
  - `checkSurfaces stays fast when many parents share children`: 여러 부모가 같은 부품을 가리켜 경로가 지수적으로 늘어나도 바로 끝남 (SEC-3.8)

- [x] **MOA-9.4: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-9.5: 구현한다**
- [x] **MOA-9.6: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-9.7: 커밋한다** — `feat(moa-render): A2UI 메시지로 surface 계산과 검사 추가`

### 렌더링

**Interfaces:**
- Consumes: `@dusunax/moa`의 부품 16종
- Produces: `MoaSurfaces(props: { messages; onAction?; onError?; isAllowedUrl?; allowSensitive? })`, `MoaAction`, `MoaRenderError = { code: string; message: string; componentId?: string }`
- DOC-7 "부품"의 대응 표, "값과 바인딩", "action", "갱신", "보안"을 구현한다. 허용 목록·기본값·이름 바꾸기·민감 부품 판정은 `catalog.ts`, 값 읽기·쓰기·action context는 `bind.ts`, 트리 그리기는 `MoaSurfaces.tsx`에 둔다.
- `onError`는 같은 오류를 렌더마다 다시 보내지 않는다. `messages`가 바뀔 때 한 번씩만 보낸다.

- [x] **MOA-9.8: 테스트를 작성한다**

  - `renders root tree with moa components`
  - `maps child, children, trigger and content`
  - `puts a Text child of Button as plain label`
  - `passes catalog defaults`: Image `fit`이 없으면 `fill`
  - `binds values and writes input back to path`
  - `user input wins over server values`
  - `resolves action context and calls onAction`
  - `leaves unknown components and missing ids empty`
  - `stops cyclic references at depth limit`
  - `stops rendering at the component limit when children are shared`: 여러 부모가 같은 부품을 가리켜도 그리는 수가 상한에서 멈춤 (SEC-3.8)
  - `does not render images by default`
  - `renders images allowed by isAllowedUrl`
  - `appends link domain`
  - `turns disallowed links into plain text`
  - `blocks sensitive components by default`
  - `renders sensitive components when allowed`
  - `passes only catalog props`: 모델이 붙이는 `props` 객체가 있어도 catalog prop만 넘어감 (SEC-3.9)
  - `drops dangerouslySetInnerHTML, style, className and event props`: Button에 넣어도 `<button>`에 그 속성이 없음 (SEC-3.9)
  - `renders strings as text, not HTML`: Text·라벨·옵션에 `<img src=x onerror=…>`를 넣어도 요소가 생기지 않음 (SEC-3.1)
  - `reports errors once per messages change`

- [x] **MOA-9.9: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-9.10: 구현한다**
- [x] **MOA-9.11: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-9.12: 커밋한다** — `feat(moa-render): MoaSurfaces 렌더러 추가`

### 스토리, 크기, 문서

- [x] **MOA-9.13: 스토리를 작성한다**

  `packages/storybook`에 `@dusunax/moa-render`, `@dusunax/moa-stream`, `@dusunax/moa-fixtures`를 workspace devDependency로 넣고, `.storybook/main.ts`에 moa처럼 `src` alias를 추가한다.
  - `Render/Surfaces`: 폼 카드, 목록 카드, 오류 자리(모르는 부품)를 한 화면에. `isAllowedUrl`·`allowSensitive`는 args로 켬
  - `Agent/Chat`: `moa-fixtures`의 `chat.json`·`tool-call.json`·`ui-card.json`을 `reduceEvent`로 끝까지 접은 정적 화면. `upTo` arg로 몇 번째 이벤트까지 접을지 고름. 타이머는 쓰지 않음
  - 설명 문자열은 MOA-6의 `i18n` 사전에 한국어·영어로 넣음

- [x] **MOA-9.14: size-limit을 설정하고 잰다** — 예산 6KB.
- [x] **MOA-9.15: README 두 벌과 changeset을 쓴다** — 지원 범위 표, 보안 기본값(이미지 차단, 링크 도메인, 민감 부품 차단)과 바꾸는 법. "Security" 절에 일반 입력란으로 하는 피싱은 막지 못한다는 한계를 적는다(SEC-3.5). changeset은 `minor`.
- [x] **MOA-9.16: 커밋한다** — `docs(moa-render): 스토리와 README 추가`

---

## MOA-10 playground

- 브랜치 `MOA-10` · PR `feat: [MOA-10] playground 추가`
- 이 ID에서는 배포하지 않는다. 로컬에서 fixture 재생과 서버 핸들러까지 만든다.

### 게이트

- [x] **MOA-10.0: 게이트를 확인한다** — SEC-3.

### 앱 뼈대와 fixture 재생

- [x] **MOA-10.1: 앱을 만든다**

  `pnpm-workspace.yaml`에 `apps/*`를 넣고 `apps/playground`를 Vite + React로 만든다. `private: true`. `moa`, `moa-stream`, `moa-render`, `moa-fixtures`는 `workspace:*`.

- [ ] **MOA-10.2: fixture 재생 화면을 만든다**

  첫 화면은 `moa-fixtures`의 `replay`로 `ui-card.json`을 재생한다. 메시지 목록은 DOC-7 "앱"대로 그린다. 화면 위에 데이터 기록 안내를 둔다.

Run: `pnpm --filter playground dev`
Expected: 키 없이 열면 대화와 카드가 차례로 그려지고, 카드 버튼을 누르면 `onAction`이 콘솔에 찍힌다.

- [ ] **MOA-10.3: 커밋한다** — `feat: playground 앱과 fixture 재생 추가`

### 서버 핸들러

**Interfaces:**
- Produces: `handleAgent(request: Request, deps: { fetch: typeof fetch }): Promise<Response>`
  - `Authorization: Bearer <키>`가 없으면 401
  - 본문을 `RunAgentInput`으로 검증하고 상한을 넘으면 413
  - `forwardedProps.model`이 없으면 기본 추천 모델, 형식이 어긋나면 400(DOC-12)
  - activity 메시지를 assistant 텍스트로 바꾸고, `forwardedProps.moaAction`을 검증해 사용자 입력으로 붙임
  - OpenRouter `chat/completions`를 `stream: true`와 `render_ui` 도구로 부르고, 응답을 AG-UI 이벤트 SSE로 바꿈
  - `render_ui` 인자(surface 하나)를 `{ version: "1.0", createSurface: 인자 }`로 감싸 `@dusunax/moa-render/core`의 `toSurfaces`·`checkSurfaces`로 검증한 뒤 `ACTIVITY_SNAPSHOT`의 `content.messages`로 보냄
  - OpenRouter 429는 `RUN_ERROR`의 `code`에 `limit_source`를 담아 보냄. 우리 Firewall 429와 앱이 구분하게 하기 위해서
- `api/agent.ts`는 `export function POST(request: Request)`에서 `handleAgent(request, { fetch })`를 부른다.

- [ ] **MOA-10.4: 추천 모델을 둔다**

  `server/model.ts`에 추천 모델 목록(`deepseek/deepseek-v4-flash` 기본, `openai/gpt-5-nano`)과 모델 이름 형식 검사 함수를 둔다. 근거는 DOC-12의 2026-11-22 평가 결과다. 화면의 추천 버튼도 이 목록을 쓴다.

- [ ] **MOA-10.4a: 시스템 프롬프트를 쓴다** — `server/prompt.ts`에 `render_ui` 형식 규칙과 완성된 회원가입 카드 예시 하나를 넣는다. 도구 인자는 surface 하나(`{ surfaceId, components, dataModel? }`)다. `props` 객체를 만들지 않고 prop을 부품에 바로 넣는다는 것, `children`은 id 문자열 배열이라는 것, Button의 `child`는 Text 부품의 id라는 것, 바인딩은 `{ "path": … }`, action은 `{ "event": { "name" } }`라는 것을 명시한다. DOC-13 평가에 쓴 프롬프트(`docs/decisions/data/2026-11-22-model-eval/eval-models.mjs`의 `FLAT_SYSTEM`)를 그대로 옮긴다.
- [ ] **MOA-10.5: OpenRouter 응답 녹화본을 만든다** — 텍스트만, `render_ui` 호출, 잘못된 `render_ui` 인자, 중간에 끊긴 응답. OpenAI 호환 SSE 형식이며 손으로 쓴다.
- [ ] **MOA-10.6: 테스트를 작성한다**

  - `rejects missing key with 401`
  - `rejects oversized body with 413`
  - `streams text as TEXT_MESSAGE events`
  - `turns render_ui into ACTIVITY_SNAPSHOT without TOOL_CALL events`
  - `wraps render_ui arguments into a createSurface message`
  - `rejects render_ui with missing id references`: Button `child`에 글자가 들어온 출력(DOC-13 평가 결과)을 오류 텍스트로 바꿈
  - `sends error text for invalid render_ui`
  - `rewrites activity messages for the model`
  - `passes moaAction as user input after validation`
  - `uses the requested model or the default`
  - `rejects malformed model names with 400`
  - `tells the user when the model does not call render_ui`
  - `passes upstream 429 limit_source as RUN_ERROR code`
  - `calls only the OpenRouter endpoint`
  - `never logs or returns the key`: `console.*`를 감시하고, OpenRouter가 실패해도 키 문자열이 어디에도 없음

- [ ] **MOA-10.7: 테스트를 실행해 실패하는지 확인한다**
- [ ] **MOA-10.8: 구현한다**
- [ ] **MOA-10.9: 테스트를 실행해 통과하는지 확인한다**
- [ ] **MOA-10.9a: 모델을 평가한다**

  `docs/decisions/data/2026-11-22-model-eval/eval-models.mjs`를 `apps/playground/scripts/eval-models.mjs`로 옮기고, 스크립트 안의 프롬프트·검사 대신 실제 `server/prompt.ts`와 `server/validate.ts`를 쓰게 바꾼다. 프롬프트 다섯 개를 모델마다 6번씩, 모델은 추천 모델 두 개. 키는 `OPENROUTER_API_KEY` 환경 변수에서만 읽고 출력하지 않는다. 실행은 사용자가 자기 터미널에서 한다. DOC-12의 통과율보다 낮아지면 원인을 찾고, 결과 표를 PR 리뷰 참고에 남긴다. 60회에 약 $0.02다.

- [ ] **MOA-10.10: 로컬 개발 서버에 핸들러를 붙인다** — `server/dev-plugin.ts`의 Vite 플러그인을 `vite.config.ts`에 등록한다. 플러그인은 `/api/agent` 요청을 `Request`로 바꿔 `handleAgent`에 넘긴다.
- [ ] **MOA-10.11: 키 입력과 모델 선택을 만든다** — `KeyInput`은 `type="password"`이고 값은 React 상태에만 둔다. 모델 선택은 DOC-7 "앱"대로 추천 버튼 두 개와 직접 입력 칸이다. 키가 있으면 `sseEvents("/api/agent", { headers: { Authorization } })`로 실행하고 고른 모델은 `forwardedProps.model`로 보낸다. DOC-7 "앱"의 안내 문구 넷(402, OpenRouter 429, Firewall 429, 도구 미호출)을 붙인다.
- [ ] **MOA-10.12: 사용자가 실제 키로 확인한다** — 에이전트는 키를 다루지 않는다. 사용자가 로컬에서 대화, 카드, 버튼 왕복을 확인하고 결과를 알려 준다.
- [ ] **MOA-10.13: 커밋한다** — `feat: playground 서버 핸들러, 키 입력, 모델 선택 추가`

---

## MOA-11 첫 배포

- 브랜치 `MOA-11` · PR `chore: [MOA-11] moa-stream·moa-render 배포와 playground 공개`

### 게이트

- [ ] **MOA-11.0: 게이트를 확인한다** — SEC-4.

### npm 배포

- [ ] **MOA-11.1: 버전을 올린다** — `pnpm changeset version`. `moa-stream`·`moa-render`가 0.1.0이 되고, 대기 중인 `.changeset/readme-english.md`로 `moa`가 0.1.2가 되는지 확인한다. `moa-fixtures`는 private이라 버전이 바뀌지 않는다.
- [ ] **MOA-11.2: 사용자가 배포한다** — 배포 전에 npm 2FA 모드가 `auth-and-writes`인지 다시 확인한다(SEC-1.5). `pnpm release`는 사용자가 로컬에서 OTP와 브라우저 인증으로 실행한다.
- [ ] **MOA-11.3: 배포를 확인한다** — 레포 밖 빈 폴더에 두 패키지를 설치해 import와 타입을 확인한다. `@dusunax/moa-render/core`를 Node에서 React 없이 import할 수 있는지도 본다. 태그를 push한다.

### playground 공개

- [ ] **MOA-11.4: Vercel 프로젝트를 설정한다** — 사용자가 프로젝트를 만들고 Root Directory를 `apps/playground`로 둔다. pnpm 12.18은 `packageManager`와 corepack으로 고정한다. 환경 변수에는 키를 넣지 않는다.
- [ ] **MOA-11.4a: CSP를 건다** (SEC-3.1, SEC-3.3)

  `apps/playground/vercel.json`의 `headers`로 모든 경로에 `Content-Security-Policy`를 건다. 시작 값은 `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'`이다. Web Analytics는 `@vercel/analytics`로 붙이고, 스크립트와 수집 요청은 같은 출처(`/_vercel/insights/*`, `/<고유 경로>/*`)로 가서 `'self'`로 충분하다(2026-11-22 문서 확인). 배포 후 콘솔에 CSP 위반이 없는지 본다.

- [ ] **MOA-11.5: 요청 수 제한을 건다** — 사용자가 Vercel Firewall에서 `/api/agent` 경로에 Rate Limit 규칙 하나를 만든다: Fixed Window 60초, IP당 20회, 넘으면 429. Hobby도 프로젝트당 규칙 1개를 쓸 수 있다(SEC-3.7).
- [ ] **MOA-11.6: 배포를 확인한다** — 배포 URL에서 fixture 재생이 되는지, `/api/agent`가 키 없이 401인지, Web Analytics가 연결되어 수집되는지 확인한다. 실제 키 확인은 사용자가 한다.
- [ ] **MOA-11.6a: 키가 로그에 남지 않는지 확인한다** (SEC-3.2) — 실제로 쓸 수 없는 가짜 키(`sk-or-v1-sec3-dummy`)로 `/api/agent`를 한 번 부르고, Vercel 런타임 로그와 그 요청의 Outgoing Requests 상세에서 그 문자열을 찾는다. 응답 헤더에 CSP가 있는지도 본다.
- [ ] **MOA-11.7: 루트 README에 두 패키지와 playground 링크를 넣는다** — `README.md`와 `README.en.md`.
- [ ] **MOA-11.8: 커밋한다** — `chore: moa-stream·moa-render 0.1.0, moa 0.1.2 배포와 playground 공개`
