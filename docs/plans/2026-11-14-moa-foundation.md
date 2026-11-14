---
id: DOC-6
type: plan
title: moa Implementation Plan
description: >
  MOA-1~MOA-6의 Step(할 일, 파일, 인터페이스, 검증 명령)을 ID별로 정한다.
  MOA ID를 진행하면서 다음 Step을 확인할 때 읽는다.
---

# moa Implementation Plan

근거: DOC-5 (스펙). 순서와 상태는 DOC-3, 진행 절차·게이트·Step 번호·커밋과 PR 규칙은 DOC-4에 있다.

**Goal:** `dusunax/design` 레포를 pnpm 모노레포로 재구성하고, 경량 부품 패키지 `@dusunax/moa`와 Storybook을 만든다.

**Tech Stack** (2026-11-14 기준 npm 최신 안정판, MOA-1.2에서 3일 규칙으로 다시 정한다): pnpm 12.18, Node 24, React 19.3, TypeScript 7.0, Tailwind CSS 4.3 (`@tailwindcss/cli`), tsdown 0.23, Vitest 5.1 + Testing Library + jsdom, Radix UI, Storybook 10.6 (`@storybook/react-vite`), size-limit 14.3, changesets 3.0, chromatic 18.14

## Global Constraints

- `engines.node`는 `>=24`, `packageManager`는 `pnpm@12.18.0`이다.
- `react`와 `react-dom`은 `^19` peerDependency다. 일반 dependency에 넣지 않는다.
- 런타임 dependency 허용 목록은 `clsx@2.1.1`, `class-variance-authority@0.7.1`, `@radix-ui/react-dialog@1.3.1`, `@radix-ui/react-tabs@1.2.1`, `@radix-ui/react-slider@1.6.1`, `@radix-ui/react-radio-group@1.5.1`, `@radix-ui/react-toggle-group@1.2.1`이다. 그 밖의 런타임 의존성은 추가하지 않는다. `tailwind-merge`는 금지다.
- Radix 타입과 prop은 export하지 않는다. 공개 prop은 각 소제목의 Interfaces에 적힌 것만 둔다.
- CSS 클래스는 `moa:` 접두사(예: `moa:flex`), 테마 변수는 `--moa-*`다. 다크 모드 셀렉터는 `[data-moa-theme="dark"]`다.
- 배포 CSS(`dist/styles.css`)에는 preflight와 전역 셀렉터(`*`, `html`, `body`, 태그 셀렉터)를 넣지 않는다.
- 모든 부품은 `className?: string`과 `weight?: number`를 받는다. `weight`는 `style.flexGrow`로 매핑한다(catalog의 `weight`).
- 타입 선언은 `isolatedDeclarations: true`로 생성한다. 그래서 공개 함수와 상수에는 반환 타입을 명시한다.
- 기본 UI 문구는 영어다. 문구를 바꿀 수 있는 prop은 각 소제목의 Interfaces에 적힌 것만 둔다.
- 문서 언어는 한국어가 기본이고 영어를 지원어로 둔다. 부품 UI 문구(영어)와 별개다.
  - MOA-1\~MOA-5에서는 README와 Storybook 설명을 한국어로만 쓴다. 영어 지원은 MOA-6에서 한 번에 한다.
  - Storybook 설명은 스토리 파일의 `parameters.docs.description`에 한국어 문자열로 바로 쓴다. 설명은 화면만으로 알 수 없는 사용 기준이 있을 때만 쓴다(예: primary는 한 화면에 하나). 이름만 봐도 아는 용도 설명은 쓰지 않는다. MOA-6에서 이 문자열을 사전으로 옮긴다. 사이드바 제목, 스토리 이름, args·prop 이름은 처음부터 영어로 쓴다.
  - 문구 prop이 있는 부품은 한국어 문구를 넣은 `Localized` 스토리를 하나 둔다.
- 스토리 제목은 역할별 폴더를 쓴다: `Foundations/*`(토큰), `Layout/*`, `Display/*`, `Actions/*`, `Inputs/*`. 순서는 `preview.tsx`의 `storySort`로 고정한다.
- 스토리는 args로 조작하는 `Playground` 하나와, 단순 variant·상태를 한 화면에 모은 `Variants`(또는 `States`) 하나를 기본으로 둔다. variant마다 스토리를 따로 만들지 않는다. 정적인 예시(문법 모음 등)와 상태를 가진 예시(controlled)도 Variants에 넣는다. 상태가 필요하면 스토리 파일 최상위에 작은 예시 컴포넌트를 두고 Variants에서 쓴다. 오류 상태처럼 부품이 보여 주는 상태는 넣고, 보안 대책이나 공격 입력 같은 특수 케이스는 스토리와 설명에 넣지 않는다(테스트와 SEC 문서가 맡는다).
- Show code는 그대로 복사해 쓸 수 있는 코드만 보인다. 스토리 도우미(`Prop`, `PropGrid`)가 들어가는 스토리는 `parameters.docs.source.code`에 실제 사용 코드를 적는다.
- 문서 표의 Description은 부품 타입의 JSDoc에서 온다. 화면만으로 알 수 없는 prop(예: `onChange`가 넘기는 값, `weight`의 뜻)에만 JSDoc을 단다. Storybook은 문서 표를 위해 `@dusunax/moa`를 소스(`src`)로 불러온다. TypeScript 7에서는 react-docgen-typescript가 동작하지 않아 기본 react-docgen을 쓴다.
- hover·focus 같은 상태는 `storybook-addon-pseudo-states` 툴바로 확인한다. 상태마다 예시를 따로 만들지 않는다.
- 변형이 없는 부품(Card)은 Playground만 둔다.
- Variants 안의 예시는 내용을 `라벨`, `버튼`, `입력값`처럼 중립적으로 쓰고, 예시는 테두리 상자 안에, 어떤 prop으로 만든 상태인지는 상자 밖 코드 캡션으로 보인다(`stories/_Prop.tsx`). 캡션에는 코드 아래에 그 variant를 언제 쓰는지 한 줄(`use`)을 붙인다. 이름이나 화면만으로 알 수 있으면 쓰지 않는다. 작은 예시를 나란히 둘 때는 `PropGrid`로 같은 너비의 칸에 놓아, 상자 크기와 캡션 위치가 줄마다 맞게 한다. variant 이름을 라벨이나 버튼 글자로 쓰지 않는다. 비밀번호처럼 의미가 있어야 하는 경우만 예외다.
- 의존성은 정확한 버전으로 저장하고, 배포된 지 3일이 안 된 버전은 쓰지 않는다. `pnpm-workspace.yaml`에 `saveExact: true`, `minimumReleaseAge: 4320`을 둔다. pnpm 12는 `.npmrc`의 `save-exact`를 읽지 않는다.
- Storybook 빌드에 들어가는 환경 변수(`STORYBOOK_*`, `VITE_*`)에는 토큰이나 키를 넣지 않는다. Storybook은 Chromatic에 공개 배포된다. 허용 목록 밖의 변수는 `check-public-env.mjs`가 빌드 전에 막는다. 변수를 새로 쓰려면 허용 목록에 이름을 추가한다.
- 레포 문서(README 등) 한국어판은 `~다` 체로 쓴다. 패키지 이름과 README에 "A2UI", "AG-UI"를 이름처럼 쓰지 않는다. 호환 대상으로만 설명한다.
- size-limit 예산(gzip)은 직접 구현 부품 전체 JS 5KB, 전체 JS 40KB, Radix 부품 하나 15KB, `styles.css` 10KB다. 리포트 모드로 두고 CI를 실패시키지 않는다.

## Review Focus

1. **Text에 `javascript:` 링크가 들어오는 경우**: 에이전트가 보낸 문자열이라 악의적인 링크가 섞일 수 있다. 링크로 만들지 않고 평문으로 보여야 한다. 대소문자를 섞거나 탭·공백을 끼운 우회도 막아야 한다. → MOA-2 Text 테스트 `does not linkify javascript: urls`, `blocks scheme bypasses`
2. **ToolCallCard 인자가 스트리밍 중이라 JSON이 불완전한 경우**: 오류 없이 원문을 그대로 보여야 한다. → MOA-4 ToolCallCard 테스트 `shows raw args when JSON is partial`
3. **Tailwind를 쓰지 않거나 자체 리셋이 있는 페이지에 `styles.css`를 넣는 경우**: 그 페이지의 기존 스타일이 바뀌면 안 된다. → MOA-1 토큰과 빌드의 `scripts/check-css.mjs`가 전역 셀렉터를 검사한다.
4. **ChoicePicker 검색어 때문에 선택된 항목이 목록에서 가려지는 경우**: 선택은 유지되어야 하고, 걸러내는 동작만으로 `onChange`가 호출되면 안 된다. → MOA-3 ChoicePicker 테스트 `keeps selection hidden by filter`
5. **TextField `number`의 값을 지운 경우**: `NaN`이 아니라 빈 문자열로 `onChange`가 호출되어야 한다. → MOA-2 TextField 테스트 `number variant reports empty string when cleared`

---

## File Structure

```
package.json                       루트 workspace 스크립트
pnpm-workspace.yaml
tsconfig.base.json                 공통 컴파일러 옵션
.changeset/config.json             (MOA-5)
.github/workflows/ci.yml           (MOA-1에서 만들고 MOA-5에서 확장)
packages/moa/
  package.json
  tsconfig.json
  tsdown.config.ts                 부품별 entry 목록
  vitest.config.ts
  vitest.setup.ts
  .size-limit.json                 (MOA-5)
  scripts/check-css.mjs            배포 CSS 검사
  scripts/gen-icons.mjs            Material Symbols → paths.ts 생성
  src/index.ts                     모든 부품 re-export
  src/styles/index.css             Tailwind import, @theme 토큰, 다크 모드
  src/utils/base.ts                BaseProps, weightStyle
  src/components/<kebab-name>/
    <Name>.tsx
    <Name>.test.tsx
    index.ts
packages/storybook/
  package.json
  .storybook/main.ts
  .storybook/preview.tsx           styles.css 불러오기, 테마 툴바
  stories/<Name>.stories.tsx
```

부품 하나에 폴더 하나를 둔다. 테스트와 entry 파일도 같은 폴더에 둔다. 부품을 추가할 때마다 `tsdown.config.ts` entry, `src/index.ts`, 스토리 파일 세 곳을 같이 수정한다.

---

## MOA-1 init: 레포 정리, 토큰, Storybook

- 브랜치 `MOA-1` · PR `chore: init moa 디자인 시스템` · **merge commit**. squash 하면 문서(MOA-1.0a), 제거(MOA-1.1), init(MOA-1.9) 커밋이 합쳐져 init 커밋이 시작점 역할을 못 한다.

### 게이트

- [x] **MOA-1.0: 게이트를 확인한다** — SEC-1. DOC-4의 게이트 확인을 따른다.

- [x] **MOA-1.0a: 이전 레포에 태그를 달고, `MOA-1` 브랜치에 문서를 먼저 커밋한다**

  문서는 init과 함께 MOA-1 PR로 올린다. `main`에 직접 올리지 않는다. 태그는 브랜치를 만들기 전 `main`에 달아, multi-touch 레포의 마지막 상태를 가리키게 한다. 문서를 따로 먼저 커밋해야 MOA-1.9 init 커밋에 문서가 섞이지 않는다. 이 커밋에서 DOC-3의 MOA-1 상태를 `진행`으로 바꾼다.

```bash
git switch main
git tag -a legacy/multi-touch -m "moa 이전 multi-touch 레포의 마지막 상태"
git push origin legacy/multi-touch
git switch -c MOA-1
git add docs
git commit -m "docs: moa 설계·플랜·규칙 문서 추가"
```

  MOA-1 PR의 커밋 순서는 문서 → 제거(MOA-1.1) → init(MOA-1.9)이다. merge commit으로 합쳐 세 커밋을 그대로 남긴다.

### 레포 정리와 workspace 뼈대

**Files:**
- Delete: `multi-touch/`, `stories/`, `public/`, `lib/`, `styles/`, `.storybook/`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `pnpm-lock.yaml`
- Modify: `package.json` (전체 교체), `.gitignore` (`dist/`, `storybook-static/`, `*.tsbuildinfo` 추가)
- Create: `pnpm-workspace.yaml`, `tsconfig.base.json`, `packages/moa/package.json`, `packages/moa/tsconfig.json`, `packages/moa/vitest.config.ts`, `packages/moa/vitest.setup.ts`, `packages/moa/src/utils/base.ts`, `packages/moa/src/utils/base.test.ts`, `packages/moa/src/index.ts`, `README.md`

**Interfaces:**
- Produces:
  - `type BaseProps = { className?: string; weight?: number }`
  - `function weightStyle(weight?: number): React.CSSProperties | undefined`: `weight`가 `undefined`이면 `undefined`를 반환하고, 숫자면 `{ flexGrow: weight }`를 반환한다.
  - `@dusunax/moa`의 스크립트: `test`(`vitest run`), `typecheck`(`tsc --noEmit`)

- [x] **MOA-1.1: Delete 목록을 지우고 제거만 따로 커밋한다**

  제거와 시작을 커밋 두 개로 나눈다. 그래야 MOA-1.9의 init 커밋에 새 파일만 들어가고, 거기서부터 moa 이력이 시작된다.

```bash
git rm -r multi-touch stories public lib styles .storybook next.config.mjs postcss.config.mjs tailwind.config.ts tsconfig.json pnpm-lock.yaml
git commit -m "chore: moa 재구성 전에 기존 multi-touch 예제와 Next.js 설정 제거"
```

- [x] **MOA-1.2: 루트 설정을 작성한다**

  먼저 Tech Stack의 버전을 "배포된 지 3일 이상 지난 최신 안정판" 기준으로 다시 정하고, 바뀌었으면 이 플랜의 버전을 같이 고친다.

  - 루트 `package.json`: `"private": true`, `packageManager`, `engines`, 스크립트(`build`, `test`, `typecheck`는 `pnpm -r <스크립트>`, `storybook`은 `pnpm --filter @dusunax/moa-storybook dev`)
  - `pnpm-workspace.yaml`:

    ```yaml
    packages: ["packages/*"]
    saveExact: true
    minimumReleaseAge: 4320
    allowBuilds:
      esbuild: false
      "@parcel/watcher": false
    ```

    `minimumReleaseAge: 4320`은 배포된 지 3일이 안 된 버전을 설치하지 않는다. 고정 버전이 3일 미만이면 설치가 실패하므로, 버전을 정할 때 3일 이상 지난 최신 안정판을 고른다. `minimumReleaseAgeExclude`는 쓰지 않는다.

    pnpm 12는 허용 여부가 정해지지 않은 빌드 스크립트가 있으면 설치를 실패시킨다. 플랜 의존성 중 빌드 스크립트가 있는 것은 위 두 개이고, 둘 다 스크립트 없이 동작한다(2026-11-14 실측). 그래서 `false`로 명시한다. 새로 막히는 패키지가 생기면 스크립트 없이 동작하는지 먼저 확인하고, 필요할 때만 `true`로 넣는다. `onlyBuiltDependencies`는 pnpm 12에서 동작하지 않는다.
  - 의존성이 들고 오는 에이전트 스킬(pnpm의 "Agent skills awaiting approval", 예: tsdown)은 승인하지 않는다(`pnpm approve` 금지).
  - `tsconfig.base.json`: `strict`, `jsx: "react-jsx"`, `module: "esnext"`, `moduleResolution: "bundler"`, `target: "es2022"`, `isolatedDeclarations: true`, `declaration: true`, `verbatimModuleSyntax: true`

- [x] **MOA-1.3: `packages/moa` 패키지 파일을 만든다**

  - `name: "@dusunax/moa"`, `version: "0.0.0"`, `type: "module"`, `sideEffects: ["*.css"]`, `license: "MIT"`
  - devDependencies: `typescript@7.0.2`, `vitest@5.1.0`, `jsdom@31.0.0`, `@testing-library/react@16.3.3`, `@testing-library/user-event@14.6.9`, `react@19.3.1`, `react-dom@19.3.1`, `@types/react@19.3.0`
  - `vitest.config.ts`: `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`
  - `vitest.setup.ts`: `afterEach(cleanup)`. jsdom에 없는 `ResizeObserver`를 빈 클래스로 채운다(Radix Slider가 필요로 한다).

- [x] **MOA-1.4: 실패하는 테스트를 작성한다**

```ts
// packages/moa/src/utils/base.test.ts
test("weightStyle maps weight to flexGrow", () => {
  expect(weightStyle(2)).toEqual({ flexGrow: 2 });
  expect(weightStyle(0)).toEqual({ flexGrow: 0 });
  expect(weightStyle(undefined)).toBeUndefined();
});
```

- [x] **MOA-1.5: `pnpm install` 후 테스트를 실행해 실패하는지 확인한다**

Run: `pnpm --filter @dusunax/moa test`
Expected: FAIL. `weightStyle`을 찾을 수 없다는 오류가 난다.

- [x] **MOA-1.6: `src/utils/base.ts`에 `BaseProps`와 `weightStyle`을 구현한다. `src/index.ts`는 일단 비워 둔다(`export {}`)**

- [x] **MOA-1.7: 테스트와 타입 검사를 실행한다**

Run: `pnpm test && pnpm typecheck`
Expected: PASS

- [x] **MOA-1.8: README를 쓴다**

  내용은 프로젝트 한 줄 소개, 패키지 표, 개발 명령, 문서 시작점(`docs/INDEX.md` 링크)이다. 한국어 `~다` 체로 쓴다. 영어판은 MOA-6에서 만든다.

- [x] **MOA-1.9: init 커밋을 만든다. 여기서부터가 moa 레포다**

```bash
git add -A
git commit -m "chore: init moa 디자인 시스템" -m "pnpm 모노레포와 @dusunax/moa 패키지 뼈대로 새로 시작한다. 이전 multi-touch 레포는 legacy/multi-touch 태그에 남아 있다."
```

  확인: `git show --stat HEAD`에 삭제된 파일 없이 추가된 파일과 수정된 파일(`package.json`, `.gitignore`)만 나와야 한다.

---

### 토큰과 빌드 파이프라인

**Files:**
- Create: `packages/moa/src/styles/index.css`, `packages/moa/tsdown.config.ts`, `packages/moa/scripts/check-css.mjs`
- Modify: `packages/moa/package.json` (scripts, exports, dependencies)

**Interfaces:**
- Consumes: MOA-1 레포 정리의 `@dusunax/moa` 패키지
- Produces:
  - 빌드 결과물: `dist/index.js`, `dist/index.d.ts`, `dist/<entry>.js`, `dist/styles.css`
  - `package.json`의 exports:
    ```json
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css",
    "./*": { "types": "./dist/*.d.ts", "import": "./dist/*.js" }
    ```
  - `button`, `input`, `textarea`는 preflight가 없어 페이지 글꼴을 물려받지 않는다. 부품에 `moa:[font-family:inherit]`를 준다.
  - hover 색은 투명도로 처리하지 않고 `primary-hover` 토큰을 쓴다.
  - 조작 요소(입력, 체크박스, default 버튼)의 테두리는 배경 대비 3:1(WCAG 1.4.11)을 넘는 `border-strong`, 장식 테두리(카드, 구분선)는 `border`를 쓴다.
  - 읽는 본문(Text body, 메시지)은 `text-prose`, 조작 요소는 `text-body`다.
  - 입력 라벨은 `text-body` `font-medium` `text-fg`다. 입력값보다 약하게 만들지 않는다.
  - 입력 오류는 네이티브 검증(`:user-invalid`)과 `invalid` prop(`aria-invalid`) 두 경로 모두 같은 `danger` 테두리로 보인다.
  - 입력 포커스는 테두리를 `primary`로 바꾸고 같은 색 1px 외곽선(간격 0)을 붙여 2px 한 줄로 보인다. 회색 테두리 위에 외곽선을 겹치지 않는다. 버튼·체크박스는 `:focus-visible` 2px 외곽선, 간격 2px다.
  - 한 줄 입력과 버튼은 높이 36px(`h-9`)로 맞춘다. preflight가 없어 입력은 content-box로 계산되므로 `box-border`를 준다.
  - disabled는 투명도 대신 `surface` 배경, `fg-muted` 글자, `border` 테두리로 보인다.
  - dark 테마는 `color-scheme: dark`를 설정해 날짜 아이콘·스피너·스크롤바 같은 브라우저 기본 UI도 dark로 그린다.
  - 색상은 Radix Colors의 Gray(중성색)와 Teal(강조색)을 기준으로 하고, 글자색은 WCAG AA(4.5:1)를 넘도록 조정했다. `primary-fg`는 light에서 흰색, dark에서 검정이다.
  - 토큰(아래 표)은 Tailwind 유틸리티 `moa:bg-surface`, `moa:text-fg-muted`, `moa:rounded-md`처럼 쓴다.

| 토큰 | light | dark |
|---|---|---|
| `--moa-color-bg` | `#ffffff` | `#111111` |
| `--moa-color-surface` | `#f0f0f0` | `#222222` |
| `--moa-color-fg` | `#202020` | `#eeeeee` |
| `--moa-color-fg-muted` | `#646464` | `#b4b4b4` |
| `--moa-color-border` | `#d9d9d9` | `#3a3a3a` |
| `--moa-color-border-strong` | `#8d8d8d` | `#6e6e6e` |
| `--moa-color-primary` | `#008573` | `#12a594` |
| `--moa-color-primary-hover` | `#00705f` | `#0eb39e` |
| `--moa-color-primary-fg` | `#ffffff` | `#111111` |
| `--moa-color-primary-subtle` | `#e0f8f3` | `#0d2d2a` |
| `--moa-color-primary-text` | `#007a69` | `#0bd8b6` |
| `--moa-color-danger` | `#ce2c31` | `#ff9592` |
| `--moa-color-success` | `#218358` | `#3dd68c` |
| `--moa-color-warning` | `#a05e00` | `#ffca16` |
| `--moa-radius-sm` / `md` / `lg` | `4px` / `8px` / `12px` | 동일 |
| `--moa-text-caption` / `body` / `prose` | `12px` / `14px` / `15px`, 줄 높이 `1.4` / `1.5` / `1.6` | 동일 |

- [x] **MOA-1.10: `src/styles/index.css`를 작성한다**

  - preflight 없이 테마와 유틸리티만 import한다.
    ```css
    @layer theme, utilities;
    @import "tailwindcss/theme.css" layer(theme) prefix(moa);
    @import "tailwindcss/utilities.css" layer(utilities) prefix(moa);
    @source "../components";
    ```
  - `@theme static`에 위 표의 light 값을 넣는다. `static`이 없으면 쓰이지 않은 토큰이 출력에서 빠진다. `@theme` 안에서는 접두사 없이 `--color-primary`, `--radius-md`, `--text-caption`으로 쓴다. 그러면 출력 결과에서 `--moa-color-primary`로 바뀌고, `moa:bg-primary` 같은 유틸리티가 생긴다.
  - `[data-moa-theme="dark"]` 블록에서는 출력되는 이름(`--moa-color-*`)으로 dark 값을 덮어쓴다.
  - `prefix()`를 개별 import에 붙이는 문법이 4.3.5에서 동작하지 않으면 `@import "tailwindcss" prefix(moa);`를 쓰고 preflight만 제외하는 방식으로 바꾼다. 어느 쪽이든 MOA-1.13 검사를 통과해야 한다.

- [x] **MOA-1.11: `scripts/check-css.mjs`를 작성한다**

  `dist/styles.css`를 읽어서 다음을 검사하고, 하나라도 어기면 `process.exit(1)`로 끝낸다.
  - `--moa-color-primary`가 들어 있다.
  - 접두사 없는 `--color-` 변수 정의가 없다.
  - 셀렉터가 `*`, `html`, `body`, `:root`(테마 변수 정의는 예외), 또는 맨 태그로 시작하는 규칙이 없다.

- [x] **MOA-1.12: 빌드 스크립트와 tsdown 설정을 추가한다**

  - devDependencies에 `tailwindcss@4.3.5`, `@tailwindcss/cli@4.3.5`, `tsdown@0.23.7`을 추가한다. dependencies에 `clsx@2.1.1`, `class-variance-authority@0.7.1`을 추가한다.
  - `tsdown.config.ts`: `entry: { index: "src/index.ts" }`(부품을 추가할 때마다 entry를 하나씩 추가한다), `format: "esm"`, `dts: true`, `fixedExtension: false`(`.js`/`.d.ts`로 출력), `deps: { neverBundle: [/^react/, /^@radix-ui\//] }`
  - scripts:
    - `build:js`: `tsdown`
    - `build:css`: `tailwindcss -i src/styles/index.css -o dist/styles.css --minify`
    - `build`: `pnpm build:js && pnpm build:css && node scripts/check-css.mjs`

- [x] **MOA-1.13: 빌드를 실행한다**

Run: `pnpm --filter @dusunax/moa build`
Expected: `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`가 생기고 check-css가 통과한다(exit 0).

- [x] **MOA-1.14: 검사 스크립트가 실제로 실패를 잡아내는지 확인한다**

  `index.css`에 임시로 `body { margin: 0 }`을 넣고 빌드한다. exit 1이 나는지 확인한 뒤 임시 코드를 되돌린다.

- [x] **MOA-1.15: 커밋한다**

```bash
git add packages/moa
git commit -m "feat(moa): 토큰과 프리픽스 CSS·ESM 빌드 파이프라인 추가"
```

---

### Storybook 패키지

**Files:**
- Create: `packages/storybook/package.json`, `packages/storybook/.storybook/main.ts`, `packages/storybook/.storybook/preview.tsx`, `packages/storybook/stories/Tokens.stories.tsx`, `packages/storybook/docs/Intro.mdx`, `packages/storybook/scripts/check-public-env.mjs`, `.github/workflows/ci.yml`, `.github/pull_request_template.md`

**Interfaces:**
- Consumes: MOA-1 토큰과 빌드의 `@dusunax/moa/styles.css`와 토큰 이름
- Produces:
  - `@dusunax/moa-storybook`(private) 스크립트: `dev`(`storybook dev -p 6013`), `build`(`storybook build`). `predev`와 `prebuild`는 `node scripts/check-public-env.mjs`다.
  - `check-public-env.mjs`: 이름이 `STORYBOOK_`나 `VITE_`로 시작하는 환경 변수 중 허용 목록(`STORYBOOK_LOCALE`)에 없는 것이 있으면 그 이름을 출력하고 exit 1로 끝낸다. 값은 출력하지 않는다.
  - 스토리 설명은 `parameters.docs.description.component`와 `.story`에 한국어로 쓴다.
  - 툴바 global `theme: "light" | "dark"`: decorator가 스토리를 감싼 요소에 `data-moa-theme`를 붙인다.
  - 이후 모든 스토리 파일의 `title`은 `Components/<Name>` 또는 `Agent/<Name>` 형식을 쓴다.

- [x] **MOA-1.16: 패키지를 만든다**

  - dependencies: `@dusunax/moa: "workspace:*"`
  - devDependencies: `storybook@10.6.7`, `@storybook/react-vite@10.6.7`, `@storybook/addon-docs@10.6.7`, `@storybook/addon-a11y@10.6.7`, `@chromatic-com/storybook@5.6.0`, `vite@8.3.8`, react 19 세트
  - `main.ts`: `framework: "@storybook/react-vite"`, `stories: ["../stories/**/*.stories.tsx", "../docs/*.mdx"]`, addons는 docs, a11y, chromatic이다. MDX와 설명 문서에는 addon-docs가 필요하다.
  - 설명을 보여 줄 스토리는 meta에 `tags: ["autodocs"]`를 둔다.
  - `docs/Intro.mdx`: moa 소개와 사용법을 한국어로 쓴다.

- [x] **MOA-1.17: `preview.tsx`를 작성한다**

  `import "@dusunax/moa/styles.css"`를 넣는다. 배경이 `--moa-color-bg`인 래퍼 decorator를 두고, 테마 툴바를 추가한다.

- [x] **MOA-1.18: `Tokens.stories.tsx`를 작성한다**

  색상 토큰 14개를 견본 칩으로 보여 준다. 값은 `getComputedStyle`로 읽어서 함께 표시한다.

- [x] **MOA-1.18a: 공개 환경 변수 검사를 확인한다** — SEC-1.6

Run: `STORYBOOK_API_TOKEN=x pnpm --filter @dusunax/moa-storybook build`
Expected: FAIL. `STORYBOOK_API_TOKEN`이 허용 목록에 없다는 메시지가 나오고, 값 `x`는 출력되지 않는다. 확인되면 SEC-1.6을 🟢로 바꾼다.

- [x] **MOA-1.19: 빌드를 확인한다**

Run: `pnpm --filter @dusunax/moa build && pnpm --filter @dusunax/moa-storybook build`
Expected: `packages/storybook/storybook-static/index.html`이 생긴다.

- [x] **MOA-1.20: 개발 서버에서 확인한다**

  `pnpm storybook`을 실행하고 Tokens 스토리를 연다. 테마 툴바를 dark로 바꾸면 견본 색이 dark 값으로 바뀌어야 한다. Tokens 설명이 한국어로 나와야 한다.

- [x] **MOA-1.21: 최소 CI를 추가한다**

  `.github/workflows/ci.yml`에 `check` job 하나만 둔다.
  - 트리거는 `push`와 `pull_request`다. `pull_request_target`은 쓰지 않는다. fork PR 코드가 secret에 접근할 수 있기 때문이다.
  - 최상위에 `permissions: contents: read`를 둔다.
  - action은 태그가 아니라 commit SHA로 고정하고, 옆에 버전 주석을 단다.
  - 의존성 install 스크립트는 `pnpm-workspace.yaml`의 `allowBuilds`대로만 실행된다(MOA-1.2).

  job은 install → `pnpm typecheck` → `pnpm test` → `pnpm build`를 실행한다. MOA-2\~MOA-4가 자동 검사를 받게 하기 위해서다. 크기 리포트와 Chromatic은 MOA-5에서 추가한다.

- [x] **MOA-1.21a: PR 템플릿을 추가한다**

  `.github/pull_request_template.md`. 본문은 `~다` 체로 쓰고, 섹션은 아래 순서다.

  ```markdown
  > ID: MOA-n

  ## 개요
  ## 변경 내용
  ## 리뷰 참고
  ## 테스트
  - [ ] `pnpm typecheck && pnpm test && pnpm build`
  - [ ] DOC-3 상태 갱신
  - [ ] 게이트 SEC가 있으면 확인 (DOC-4)
  ```

- [x] **MOA-1.22: 커밋한다**

```bash
git add packages/storybook pnpm-lock.yaml
git commit -m "feat(storybook): Storybook 10 패키지와 토큰 스토리 추가"
git add .github
git commit -m "ci: 타입·테스트·빌드 검사 워크플로와 PR 템플릿 추가"
```

---

## MOA-2 기본 부품

- 브랜치 `MOA-2` · PR `feat(moa): 기본 부품 추가`
- 너무 크면 레이아웃\~Button과 TextField\~DateTimeInput으로 나눈다. 뒤쪽은 새 번호를 받고, 제목은 `feat(moa): 레이아웃·표시 기본 부품 추가`, `feat(moa): 입력 기본 부품 추가`로 쓴다.

### 레이아웃 (Row, Column, List, Card, Divider)

**Files:**
- Create: `packages/moa/src/components/{row,column,list,card,divider}/{<Name>.tsx,index.ts}`, `packages/moa/src/components/layout.ts`(공통 매핑), `packages/moa/src/components/layout.test.tsx`(5종 테스트를 한 파일에), `packages/storybook/stories/{RowColumn,Card,List,Divider}.stories.tsx`
- Modify: `tsdown.config.ts`(entry 5개), `src/index.ts`

**Interfaces:**
- Consumes: `BaseProps`, `weightStyle`
- Produces:
  - `type Justify = "start" | "center" | "end" | "spaceBetween" | "spaceAround" | "spaceEvenly" | "stretch"`
  - `type Align = "start" | "center" | "end" | "stretch"`
  - `Row(props: BaseProps & { justify?: Justify; align?: Align; children?: ReactNode }): JSX.Element`. 기본값은 `justify="start"`, `align="stretch"`이다. `Column`도 같은 시그니처다.
  - `List(props: BaseProps & { direction?: "vertical" | "horizontal"; align?: Align; children?: ReactNode })`: `<ul>`로 렌더링하고, 자식 하나하나를 `<li>`로 감싼다.
  - `Card(props: BaseProps & { children?: ReactNode })`
  - `Divider(props: BaseProps & { axis?: "horizontal" | "vertical" })`: `role="separator"`와 `aria-orientation`을 붙인다.
  - 매핑은 `spaceBetween→moa:justify-between`, `spaceAround→moa:justify-around`, `spaceEvenly→moa:justify-evenly`, `stretch→moa:justify-stretch`, align은 `moa:items-*`이다.

- [x] **MOA-2.1: 실패하는 테스트를 작성한다**

```tsx
test("Row maps justify and align to classes", () => {
  render(<Row justify="spaceBetween" align="center">x</Row>);
  const el = screen.getByText("x");
  expect(el).toHaveClass("moa:flex-row", "moa:justify-between", "moa:items-center");
});
test("Column defaults to start/stretch", () => {
  render(<Column>x</Column>);
  expect(screen.getByText("x")).toHaveClass("moa:flex-col", "moa:justify-start", "moa:items-stretch");
});
test("weight becomes flexGrow", () => {
  render(<Card weight={2}>x</Card>);
  expect(screen.getByText("x")).toHaveStyle({ flexGrow: "2" });
});
test("List wraps each child in listitem", () => {
  render(<List><span>a</span><span>b</span></List>);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
test("Divider exposes orientation", () => {
  render(<Divider axis="vertical" />);
  expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
});
```

  `toHaveClass` 같은 matcher를 쓰려면 `vitest.setup.ts`에 `@testing-library/jest-dom/vitest`가 필요하다. 이 Step에서 `@testing-library/jest-dom@7.0.1`을 devDependency로 추가한다.

- [x] **MOA-2.2: 테스트를 실행해 실패하는지 확인한다**

Run: `pnpm --filter @dusunax/moa test -- layout row column list card divider`
Expected: FAIL. 모듈이 없다는 오류가 난다.

- [x] **MOA-2.3: 5개 부품을 구현한다**

  `layout.ts`에 `justifyClass: Record<Justify, string>`와 `alignClass: Record<Align, string>`를 둔다. Card는 `moa:bg-bg moa:border moa:border-border moa:rounded-md moa:p-4` 클래스를 쓴다. 채움과 테두리를 함께 쓰지 않는다.

- [x] **MOA-2.4: 테스트를 실행한다**

Run: `pnpm --filter @dusunax/moa test`
Expected: PASS

- [x] **MOA-2.5: 레이아웃 부품 스토리를 부품마다 작성한다**

  Row·Column(같은 prop이라 한 스토리, justify 7종·align 4종·weight), Card, List(방향 2종), Divider(축 2종)를 각자의 스토리 파일에 둔다. 빌드가 통과하는지 확인한다(MOA-1.19 명령).

- [x] **MOA-2.6: 커밋한다** — `feat(moa): Row·Column·List·Card·Divider 레이아웃 부품 추가`

---

### Text

**Files:**
- Create: `src/components/text/{Text.tsx,Text.test.tsx,markdown.ts,markdown.test.ts,index.ts}`, `stories/Text.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces:
  - `Text(props: BaseProps & { text: string; variant?: "body" | "caption" }): JSX.Element`. 기본값은 `body`다.
  - `parseInline(src: string): InlineNode[]`
  - `type InlineNode = { type: "text" | "strong" | "em" | "code"; value: string } | { type: "link"; value: string; href: string } | { type: "br" }`
  - 지원 문법: `**굵게**`, `*기울임*`, `` `코드` ``, `[라벨](url)`, 줄바꿈 `\n`. 링크는 `new URL(href).protocol`이 `http:`, `https:`, `mailto:`일 때만 허용한다. 문자열 앞부분 비교는 쓰지 않는다. 파싱에 실패하거나 다른 프로토콜이면 `text` 노드가 된다. 중첩 문법은 지원하지 않는다.

- [x] **MOA-2.7: 실패하는 테스트를 작성한다**

```ts
test("parses strong, em, code, link, br", () => {
  expect(parseInline("a **b** *c* `d` [e](https://x.dev)\nf")).toEqual([
    { type: "text", value: "a " }, { type: "strong", value: "b" }, { type: "text", value: " " },
    { type: "em", value: "c" }, { type: "text", value: " " }, { type: "code", value: "d" },
    { type: "text", value: " " }, { type: "link", value: "e", href: "https://x.dev" },
    { type: "br" }, { type: "text", value: "f" },
  ]);
});
test("does not linkify javascript: urls", () => {
  expect(parseInline("[x](javascript:alert(1))")).toEqual([
    { type: "text", value: "[x](javascript:alert(1))" },
  ]);
});
test("blocks scheme bypasses", () => {
  for (const href of ["JaVaScRiPt:alert(1)", " javascript:alert(1)", "java\tscript:alert(1)", "data:text/html,x"]) {
    expect(parseInline(`[x](${href})`).some((n) => n.type === "link")).toBe(false);
  }
});
test("react blocks javascript: href", () => {
  // SEC-1.1 근거. 실패하면 SEC-1.1을 🟡로 되돌린다
  const { container } = render(<a href="javascript:alert(1)">x</a>);
  expect(container.querySelector("a")?.getAttribute("href") ?? "").not.toContain("alert");
});
test("never renders raw HTML", () => {
  render(<Text text="<img src=x onerror=alert(1)>" />);
  expect(document.querySelector("img")).toBeNull();
});
test("caption variant uses caption size", () => {
  render(<Text text="hi" variant="caption" />);
  expect(screen.getByText("hi")).toHaveClass("moa:text-caption");
});
```

- [x] **MOA-2.8: 테스트를 실행해 실패하는지 확인한다** — `pnpm --filter @dusunax/moa test -- text`. FAIL이 나야 한다.
- [x] **MOA-2.9: `markdown.ts`의 `parseInline`과 `Text.tsx`를 구현한다**

  `parseInline`은 정규식 하나로 토큰을 하나씩 읽는 방식으로 만든다. 본문은 부정 문자 클래스(`[^*]+` 등)로 잡고 수량자를 중첩하지 않는다. 링크는 `<a target="_blank" rel="noopener noreferrer">`로 렌더링한다. 감싸는 요소는 `<p>`를 쓴다.

- [x] **MOA-2.10: 테스트를 실행한다** — PASS가 나야 한다. `react blocks javascript: href`가 실패하면 SEC-1.1을 🟡로 되돌린다.
- [x] **MOA-2.11: 스토리를 작성한다** — Variants 하나에 body, caption, Markdown 문법
- [x] **MOA-2.12: 커밋한다** — `feat(moa): 간단한 Markdown을 지원하는 Text 추가`

---

### Icon

**Files:**
- Create: `scripts/gen-icons.mjs`, `src/components/icon/{names.ts,paths.ts(생성됨),Icon.tsx,Icon.test.tsx,index.ts}`, `stories/Icon.stories.tsx`
- Modify: `package.json`(devDependency `@material-symbols/svg-400@0.48.3`, 스크립트 `gen:icons`), `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces:
  - `ICON_NAMES`: catalog의 59개 이름을 그대로 담은 readonly 튜플이다(`accountCircle`부터 `warning`까지, 스펙의 catalog 목록 순서).
  - `type IconName = (typeof ICON_NAMES)[number]`
  - `Icon(props: BaseProps & { name: IconName | BrandIconName | { svgPath: string }; size?: number; label?: string }): JSX.Element`. `BrandIconName`은 catalog 밖의 moa 전용 이름(`"moa"`)이고 `brand.ts`에 둔다. `ICON_NAMES`에는 넣지 않는다. `size` 기본값은 24다. `label`이 없으면 `aria-hidden="true"`, 있으면 `role="img"`와 `aria-label`을 붙인다. `viewBox`는 `0 -960 960 960`(Material Symbols 기준)이고 `fill="currentColor"`다.
  - `scripts/gen-icons.mjs`: camelCase 이름을 snake_case로 바꿔서 `@material-symbols/svg-400/outlined/<snake>.svg`의 `d` 속성을 읽는다. 결과는 `paths.ts`에 `Record<IconName, string>`으로 쓴다. 파일이 없는 이름은 스크립트 안의 `OVERRIDES` 표(예: `favoriteOff → heart_broken`)로 대체한다. 그래도 없으면 이름 목록을 출력하고 exit 1로 끝낸다.

- [x] **MOA-2.13: 실패하는 테스트를 작성한다**

```tsx
test("every catalog name has a path", () => {
  expect(ICON_NAMES).toHaveLength(59);
  for (const n of ICON_NAMES) expect(ICON_PATHS[n]).toMatch(/^[Mm]/); // path는 moveto로 시작한다
});
test("decorative by default, labelled when label given", () => {
  const { container, rerender } = render(<Icon name="send" />);
  expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  rerender(<Icon name="send" label="Send" />);
  expect(screen.getByRole("img", { name: "Send" })).toBeInTheDocument();
});
test("accepts custom svgPath", () => {
  const { container } = render(<Icon name={{ svgPath: "M0 0h10" }} />);
  expect(container.querySelector("path")).toHaveAttribute("d", "M0 0h10");
});
```

- [x] **MOA-2.14: 테스트를 실행해 실패하는지 확인한다** — FAIL이 나야 한다.
- [x] **MOA-2.15: `names.ts`를 쓰고, `pnpm --filter @dusunax/moa gen:icons`로 `paths.ts`를 생성한다**

  exit 1이 나면 출력된 이름마다 `OVERRIDES`에 Material Symbols 대체 이름을 하나씩 정한다. `paths.ts`는 생성 파일이지만 커밋한다. 런타임에 Material Symbols 패키지가 필요 없게 하기 위해서다. 파일 맨 위에 Apache-2.0 출처 주석을 단다.

- [x] **MOA-2.16: `Icon.tsx`를 구현하고 테스트를 실행한다** — PASS가 나야 한다.
- [x] **MOA-2.17: 스토리를 작성한다** — 59개 아이콘 격자에 이름을 함께 표시하고, size와 label 예시를 둔다.
- [x] **MOA-2.18: 커밋한다** — `feat(moa): catalog 59종 SVG path 기반 Icon 추가`

---

### Image

**Files:**
- Create: `src/components/image/{Image.tsx,Image.test.tsx,index.ts}`, `stories/Image.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces: `Image(props: BaseProps & { url: string; description?: string; fit?: "contain" | "cover" | "fill" | "none" | "scaleDown"; variant?: "icon" | "avatar" | "smallFeature" | "mediumFeature" | "largeFeature" | "header" })`
  - 기본값은 `fit="cover"`, `variant="mediumFeature"`다. catalog 기본값은 `fill`이지만 비율이 다른 이미지가 찌그러져서 `cover`로 바꿨다.
  - 크기: icon 24px, avatar 40px(원형), smallFeature 96px, mediumFeature 160px, largeFeature 240px. 앞의 값은 모두 정사각형이다. header는 너비 100%, 높이 200px다.
  - `alt`는 `description ?? ""`이고, `loading="lazy"`를 붙인다.

- [x] **MOA-2.19: 테스트를 작성한다**

  - `scaleDown fit maps to object-scale-down`
  - `avatar is round 40px`: `moa:size-10 moa:rounded-full` 클래스를 확인한다.
  - `alt falls back to empty string`

- [x] **MOA-2.20: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-2.21: 구현한다**
- [x] **MOA-2.22: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-2.23: 스토리를 작성한다** — variant 6종과 fit 5종
- [x] **MOA-2.24: 커밋한다** — `feat(moa): Image 추가`

---

### Button

**Files:**
- Create: `src/components/button/{Button.tsx,Button.test.tsx,index.ts}`, `stories/Button.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces: `Button(props: BaseProps & Omit<ComponentPropsWithoutRef<"button">, "className"> & { variant?: "default" | "primary" | "borderless" })`
  - `type` 기본값은 `"button"`이다. 변형은 `cva`로 정의한다. `ref`는 React 19 방식대로 prop으로 전달한다.

- [x] **MOA-2.25: 테스트를 작성한다**

  - `defaults to type=button`
  - `primary uses primary tokens`: `moa:bg-primary moa:text-primary-fg` 클래스를 확인한다.
  - `calls onClick and respects disabled`: user-event로 클릭한다. disabled 상태에서는 호출되면 안 된다.

- [x] **MOA-2.26: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-2.27: 구현한다**
- [x] **MOA-2.28: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-2.29: 스토리를 작성한다** — variant 3종, disabled, Icon과 함께 쓴 예
- [x] **MOA-2.30: 커밋한다** — `feat(moa): Button 추가`

---

### TextField

**Files:**
- Create: `src/components/text-field/{TextField.tsx,TextField.test.tsx,index.ts}`, `stories/TextField.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces: `TextField(props: BaseProps & { label: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; placeholder?: string; variant?: "shortText" | "longText" | "number" | "obscured"; disabled?: boolean; invalid?: boolean })`
  - variant별 요소: `shortText`는 `<input type="text">`, `longText`는 `<textarea rows={3}>`, `number`는 `<input type="number" inputMode="decimal">`, `obscured`는 `<input type="password">`다.
  - `label`은 `useId`로 연결한다. `onChange`는 이벤트가 아니라 문자열을 넘긴다.

- [x] **MOA-2.31: 테스트를 작성한다**

```tsx
test("label is associated", () => {
  render(<TextField label="Name" />);
  expect(screen.getByLabelText("Name")).toBeInstanceOf(HTMLInputElement);
});
test("longText renders textarea, obscured renders password", () => { /* 각각 확인 */ });
test("number variant reports empty string when cleared", async () => {
  const onChange = vi.fn();
  render(<TextField label="N" variant="number" defaultValue="3" onChange={onChange} />);
  await userEvent.clear(screen.getByLabelText("N"));
  expect(onChange).toHaveBeenLastCalledWith("");
});
```

- [x] **MOA-2.32: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-2.33: 구현한다**
- [x] **MOA-2.34: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-2.35: 스토리를 작성한다** — Variants 하나에 variant 4종, disabled, invalid, controlled
- [x] **MOA-2.36: 커밋한다** — `feat(moa): TextField 추가`

---

### CheckBox와 DateTimeInput

**Files:**
- Create: `src/components/check-box/*`, `src/components/date-time-input/*`, `stories/CheckBox.stories.tsx`, `stories/DateTimeInput.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces:
  - `CheckBox(props: BaseProps & { label: string; value?: boolean; defaultValue?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean })`
    - 네이티브 `<input type="checkbox">`에 `moa:appearance-none`을 적용한다. 체크 표시는 Material Symbols `check` path 하나만 부품 안에 두고 그린다. `Icon`을 import하면 아이콘 59개가 모두 번들에 들어간다. catalog처럼 체크 상태를 `value`로 받는다.
  - `DateTimeInput(props: BaseProps & { label: string; value?: string; defaultValue?: string; onChange?: (iso: string) => void; enableDate?: boolean; enableTime?: boolean; min?: string; max?: string; invalid?: boolean })`
    - 입력 type: 날짜와 시간이 모두 켜지면 `datetime-local`, 시간만 켜지면 `time`, 그 밖에는 `date`다. 둘 다 꺼진 경우도 `date`다.

- [x] **MOA-2.37: 테스트를 작성한다**

  - `CheckBox toggles and reports boolean`
  - `CheckBox is reachable by label`
  - `DateTimeInput picks input type from flags`: 네 가지 조합을 모두 확인한다.
  - `DateTimeInput passes min/max through`

- [x] **MOA-2.38: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-2.39: 구현한다**
- [x] **MOA-2.40: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-2.41: 스토리를 작성한다**
- [x] **MOA-2.42: 커밋한다** — `feat(moa): 네이티브 기반 CheckBox·DateTimeInput 추가`

---

## MOA-3 의존성 있는 부품

- 브랜치 `MOA-3` · PR `feat(moa): Modal·Tabs·Slider·ChoicePicker 의존성 있는 부품 추가`

### Modal (Radix Dialog)

**Files:**
- Create: `src/components/modal/*`, `stories/Modal.stories.tsx`
- Modify: `package.json`(`@radix-ui/react-dialog@1.3.1`), `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces: `Modal(props: BaseProps & { trigger: ReactElement; title: string; children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void })`
  - `trigger`는 Radix `Trigger asChild`로 감싼다. `title`은 필수이고 화면에 보이는 제목이다(Dialog 접근성 요구사항). 닫기 버튼의 접근성 이름은 "Close"다. CheckBox처럼 close path 하나만 부품 안에 둔다(`Icon`을 import하면 아이콘 59개가 모두 번들에 들어간다).
  - 포털 안의 내용에도 테마가 적용되어야 한다. 그래서 Content에 트리거 근처 조상의 `data-moa-theme` 값을 복사한다. 조상을 찾는 방법은 `closest("[data-moa-theme]")`다.

- [x] **MOA-3.1: 테스트를 작성한다**

  - `opens from trigger and shows title as dialog name`: `getByRole("dialog", { name: "Title" })`
  - `closes on Escape and via close button`
  - `controlled open calls onOpenChange(false)`
  - `inherits dark theme inside portal`: `<div data-moa-theme="dark">`로 감싼 경우 dialog가 dark 테마를 가진 조상 안에 있거나, 그 속성을 직접 가지고 있어야 한다.

- [x] **MOA-3.2: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-3.3: 구현한다**
- [x] **MOA-3.4: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-3.5: 스토리를 작성한다** — 기본, controlled, 긴 내용 스크롤
- [x] **MOA-3.6: 커밋한다** — `feat(moa): Radix Dialog 기반 Modal 추가`

---

### Tabs와 Slider (Radix)

**Files:**
- Create: `src/components/tabs/*`, `src/components/slider/*`, `stories/Tabs.stories.tsx`, `stories/Slider.stories.tsx`
- Modify: `package.json`(`@radix-ui/react-tabs@1.2.1`, `@radix-ui/react-slider@1.6.1`), `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces:
  - `Tabs(props: BaseProps & { tabs: { title: string; child: ReactNode }[]; defaultIndex?: number; onChange?: (index: number) => void })`
    - catalog와 맞춰 탭 내용 필드 이름은 `child`다. Radix의 `value`는 내부적으로 index 문자열을 쓴다.
  - `Slider(props: BaseProps & { label: string; min?: number; max: number; steps?: number; value?: number; defaultValue?: number; onChange?: (value: number) => void })`
    - `min` 기본값은 0이다. `step`은 `steps`가 있으면 `(max - min) / steps`, 없으면 `(max - min) / 100`이다. 단일 thumb만 지원한다. `aria-label`은 `label`이고, 현재 값을 라벨 옆에 표시한다.

- [x] **MOA-3.7: 테스트를 작성한다**

  - `Tabs switches panel with arrow keys`
  - `Tabs defaultIndex selects tab`
  - `Slider snaps to steps`: `min=0`, `max=10`, `steps=5`일 때 오른쪽 화살표 한 번에 `onChange(2)`가 호출된다.
  - `Slider exposes label`: `getByRole("slider", { name: "Volume" })`

- [x] **MOA-3.8: 테스트를 실행해 실패하는지 확인한다**
- [x] **MOA-3.9: 구현한다**
- [x] **MOA-3.10: 테스트를 실행해 통과하는지 확인한다**
- [x] **MOA-3.11: 스토리를 작성한다**
- [x] **MOA-3.12: 커밋한다** — `feat(moa): Radix 기반 Tabs·Slider 추가`

---

### ChoicePicker

**Files:**
- Create: `src/components/choice-picker/*`, `stories/ChoicePicker.stories.tsx`
- Modify: `package.json`(`@radix-ui/react-radio-group@1.5.1`, `@radix-ui/react-toggle-group@1.2.1`), `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Consumes: MOA-2 CheckBox·DateTimeInput의 `CheckBox`
- Produces: `ChoicePicker(props: BaseProps & { label: string; options: { label: string; value: string }[]; value?: string[]; defaultValue?: string[]; onChange?: (values: string[]) => void; variant?: "multipleSelection" | "mutuallyExclusive"; displayStyle?: "checkbox" | "chips"; filterable?: boolean; filterPlaceholder?: string })`
  - 기본값은 `variant="mutuallyExclusive"`, `displayStyle="checkbox"`, `filterPlaceholder="Search"`다.
  - 렌더링 조합:
    - 단일 선택 + checkbox → RadioGroup
    - 단일 선택 + chips → ToggleGroup `type="single"`
    - 다중 선택 + checkbox → CheckBox 목록
    - 다중 선택 + chips → ToggleGroup `type="multiple"`
  - 단일 선택이어도 값은 길이 0\~1인 배열이다(catalog의 `DynamicStringList`).
  - `filterable`이면 label을 대소문자 구분 없이 부분 일치로 거른다. 그룹 이름은 `role="group"`(또는 radiogroup)에 `aria-label={label}`로 붙인다.

- [ ] **MOA-3.13: 테스트를 작성한다**

  - `mutuallyExclusive checkbox is a radiogroup`
  - `multipleSelection chips toggles multiple values`: `onChange(["a","b"])`가 호출된다.
  - `single chips can deselect to empty array`
  - `filter narrows options case-insensitively`
  - `keeps selection hidden by filter`: `defaultValue=["b"]`인 상태에서 검색어를 입력해 b가 목록에서 사라져도 `onChange`가 호출되지 않는다. 검색어를 지우면 b가 여전히 선택되어 있다.

- [ ] **MOA-3.14: 테스트를 실행해 실패하는지 확인한다**
- [ ] **MOA-3.15: 구현한다**

  선택 상태는 부품 하나에서 관리하고, 네 가지 렌더러는 그 상태를 표시만 한다.

- [ ] **MOA-3.16: 테스트를 실행해 통과하는지 확인한다**
- [ ] **MOA-3.17: 스토리를 작성한다** — 네 조합과 filterable
- [ ] **MOA-3.18: 커밋한다** — `feat(moa): ChoicePicker 추가`

---

## MOA-4 에이전트 부품

- 브랜치 `MOA-4` · PR `feat(moa): 에이전트 부품 추가`

### 에이전트 부품 (MessageBubble, StreamingText, RunStatus)

**Files:**
- Create: `src/components/{message-bubble,streaming-text,run-status}/*`, `stories/Agent.stories.tsx`
- Modify: `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Produces:
  - `MessageBubble(props: BaseProps & { role: "user" | "assistant" | "system"; children: ReactNode })`
    - user는 오른쪽 정렬 + primary 배경, assistant는 왼쪽 정렬 + surface 배경, system은 가운데 정렬 + caption 크기의 fg-muted다. `data-role` 속성을 붙인다.
  - `StreamingText(props: BaseProps & { text: string; streaming: boolean })`
    - 줄바꿈을 유지하는 평문으로 보여 준다(`moa:whitespace-pre-wrap`). 스트리밍 중에는 Markdown을 해석하지 않는다. 그래야 문법이 반쯤 들어왔을 때 화면이 깜빡이지 않는다.
    - 컨테이너에 `aria-live="polite"`와 `aria-busy={streaming}`을 붙인다. `streaming`일 때만 `aria-hidden` 커서(`▍`, 깜빡임 애니메이션)를 붙인다. `prefers-reduced-motion`이면 깜빡이지 않는다.
  - `RunStatus(props: BaseProps & { status: "idle" | "running" | "finished" | "error"; message?: string; labels?: Partial<Record<"idle" | "running" | "finished" | "error", string>> })`
    - `role="status"`를 붙인다. 기본 라벨은 `Idle`, `Running`, `Done`, `Error`다. 상태 점 색은 fg-muted, primary, success, danger다. running이면 점이 펄스한다.

- [ ] **MOA-4.1: 테스트를 작성한다**

  - `MessageBubble marks role`
  - `StreamingText shows cursor only while streaming`
  - `StreamingText is aria-busy while streaming`
  - `StreamingText keeps markdown literal`: `"**a"`가 그대로 보여야 한다.
  - `RunStatus renders default and custom labels`
  - `RunStatus error shows message`

- [ ] **MOA-4.2: 테스트를 실행해 실패하는지 확인한다**
- [ ] **MOA-4.3: 구현한다**
- [ ] **MOA-4.4: 테스트를 실행해 통과하는지 확인한다**
- [ ] **MOA-4.5: 스토리를 작성한다**

  대화 예시(user → assistant 스트리밍 → finished)를 만든다. 스트리밍 스토리는 `args.text`와 `args.streaming`으로 상태를 고정한 정적 스냅샷이다. 타이머는 쓰지 않는다.

- [ ] **MOA-4.6: 커밋한다** — `feat(moa): MessageBubble·StreamingText·RunStatus 에이전트 부품 추가`

---

### ToolCallCard

**Files:**
- Create: `src/components/tool-call-card/*`
- Modify: `stories/Agent.stories.tsx`, `tsdown.config.ts`, `src/index.ts`

**Interfaces:**
- Consumes: MOA-4 에이전트 부품의 `RunStatus` 색 규칙, `Icon`
- Produces: `ToolCallCard(props: BaseProps & { name: string; status: "pending" | "running" | "finished" | "error"; args?: string; result?: string; defaultOpen?: boolean })`
  - 상태 이름은 RunStatus와 맞춘다. 대기 상태만 `idle` 대신 `pending`을 쓴다. 배지 색은 pending fg-muted, running primary, finished success, error danger다.
  - 네이티브 `<details>`/`<summary>`로 만든다. summary에는 도구 이름과 상태 배지를 넣는다.
  - `args`와 `result`는 원문 문자열이다. `JSON.parse`에 성공하면 들여쓰기 2칸으로 다시 출력한다. 실패하면 원문을 그대로 `<pre>`로 보여 준다.

- [ ] **MOA-4.7: 테스트를 작성한다**

  - `pretty-prints valid JSON args`
  - `shows raw args when JSON is partial`: `args='{"city":"Seo'`일 때 오류 없이 원문이 보여야 한다.
  - `error status shows result in danger color`
  - `defaultOpen opens details`

- [ ] **MOA-4.8: 테스트를 실행해 실패하는지 확인한다**
- [ ] **MOA-4.9: 구현한다**
- [ ] **MOA-4.10: 테스트를 실행해 통과하는지 확인한다**
- [ ] **MOA-4.11: 스토리를 작성한다** — Agent 스토리에 pending, 인자 스트리밍 중, finished, error를 추가한다.
- [ ] **MOA-4.12: 커밋한다** — `feat(moa): ToolCallCard 추가`

---

## MOA-5 크기 리포트·배포·Chromatic

- 브랜치 `MOA-5` · PR `chore(moa): 크기 리포트·배포·Chromatic 설정`

### 게이트

- [ ] **MOA-5.0: 게이트를 확인한다** — SEC-2. DOC-4의 게이트 확인을 따른다. SEC-2에서 나온 수정 Step은 MOA-5 안에 `MOA-5.0a`처럼 붙여 넣는다.

### 크기 리포트와 npm 배포 설정

**Files:**
- Create: `packages/moa/.size-limit.json`, `.changeset/config.json`, `.changeset/initial-release.md`, `packages/moa/README.md`
- Modify: 루트 `package.json`(devDependency `@changesets/cli@3.0.3`, 스크립트 `size`, `changeset`, `release`), `packages/moa/package.json`(devDependencies `size-limit@14.3.0`, `@size-limit/preset-small-lib@14.3.0`, `publishConfig.access: "public"`, `files: ["dist"]`, `repository`)

**Interfaces:**
- Produces:
  - `.size-limit.json` 항목: `core`(직접 구현 부품만 import, 5 kB), `all`(`dist/index.js`, 40 kB), `modal`, `tabs`, `slider`, `choice-picker`(각 15 kB), `css`(`dist/styles.css`, 10 kB). `react`는 ignore한다.
  - 루트 `pnpm size`: 리포트를 출력한다. CI에서는 실패로 처리하지 않는다(MOA-5의 CI와 Chromatic).
  - changeset `initial-release.md`: `@dusunax/moa`를 `minor`로 올려 `0.1.0`이 되게 한다.
  - `packages/moa/README.md`(한국어)는 npm 페이지에 그대로 보인다. "보안" 절을 둔다. 내용은 Image와 Text 링크가 에이전트가 정한 URL을 불러오므로 프롬프트 인젝션으로 데이터가 새어 나갈 수 있다는 것, 이를 막으려면 쓰는 쪽이 CSP `img-src`나 출처 허용 목록을 둬야 한다는 것이다.

- [ ] **MOA-5.1: 설정 파일을 작성한다**
- [ ] **MOA-5.2: 빌드와 크기 리포트를 실행한다**

Run: `pnpm build && pnpm size`
Expected: 항목 7개의 크기가 출력된다. 예산을 넘은 항목이 있으면 리포트에 그 이름과 차이를 적어 둔다. 실패로 처리하지는 않는다.

- [ ] **MOA-5.3: 배포 결과물을 미리 확인한다**

Run: `pnpm --filter @dusunax/moa pack --dry-run`
Expected: `dist/`, `package.json`, `README.md`만 포함되고 `src/`는 없다.

- [ ] **MOA-5.4: 로컬 배포 조건을 확인한다**

  배포는 사용자가 로컬에서 `pnpm release`로 하고, CI 배포는 두지 않는다. `npm profile get`의 2FA 모드가 여전히 `auth-and-writes`인지 확인한다. 바뀌었으면 SEC-1.5를 🟡로 되돌린다. README의 배포 절에 "로컬에서 2FA OTP를 넣어 배포한다"를 적는다.

- [ ] **MOA-5.5: 커밋한다** — `chore(moa): size-limit 리포트와 changesets 배포 설정 추가`

  실제 `pnpm release`(npm publish)는 이 플랜에서 실행하지 않는다. 사용자가 따로 승인하면 실행한다.

---

### CI와 Chromatic

**Files:**
- Modify: `.github/workflows/ci.yml`(MOA-1에서 만든 파일), `packages/storybook/package.json`(devDependency `chromatic@18.14.3`, 스크립트 `chromatic`), `packages/storybook/.storybook/preview.tsx`(Chromatic 실행 중에는 애니메이션 끄기)

**Interfaces:**
- Produces:
  - 워크플로 `ci`: push와 PR에서 실행한다.
    - `check` job: MOA-1에서 만든 단계 뒤에 `pnpm size`(`continue-on-error: true`)를 추가한다.
    - `chromatic` job: `check` 다음에 실행한다. `pnpm --filter @dusunax/moa-storybook exec chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }} --only-changed --exit-zero-on-changes`를 쓴다. `fetch-depth: 0`이 필요하다(TurboSnap 때문). fork PR에는 secret이 없으므로 `if: github.event_name == 'push' || github.event.pull_request.head.repo.full_name == github.repository` 조건을 둔다.
  - 사용자가 준비할 것: Chromatic 프로젝트 생성, 레포 secret `CHROMATIC_PROJECT_TOKEN` 등록

- [ ] **MOA-5.6: Chromatic 팁을 사용자에게 알리고, Environment와 토큰을 준비한다** — 팁 주제: TurboSnap, 스냅샷 한도, 테마 모드 적용 범위, 애니메이션·스트리밍 스토리 고정. `chromatic` Environment를 만들어 배포 브랜치를 main과 MOA 브랜치로 제한하고, `CHROMATIC_PROJECT_TOKEN`은 레포 secret이 아니라 이 Environment에 넣는다. `chromatic` job에 `environment: chromatic`을 둔다.
- [ ] **MOA-5.7: `preview.tsx`에 Chromatic 실행을 감지하는 코드를 추가한다**

  `isChromatic()`이면 `* { animation: none !important; }`를 넣는다. StreamingText 커서와 RunStatus 펄스가 고정되는지 확인한다.

- [ ] **MOA-5.8: `ci.yml`에 `pnpm size` 단계와 `chromatic` job을 추가한다**
- [ ] **MOA-5.9: 로컬에서 Chromatic을 한 번 실행한다**

Run: `pnpm --filter @dusunax/moa-storybook chromatic` (토큰은 `.env`의 `CHROMATIC_PROJECT_TOKEN`에서 읽는다. `.env*`는 이미 `.gitignore`에 있다)
Expected: 빌드가 업로드되고, 기준 스냅샷 승인을 기다리는 URL이 출력된다.

- [ ] **MOA-5.10: 커밋한다** — `ci(moa): 크기 리포트와 Chromatic 워크플로 추가`

---

## MOA-6 문서 영어 지원

- 브랜치 `MOA-6` · PR `docs: 문서 영어 지원`

### README와 Storybook 영어 지원

**Files:**
- Create: `README.en.md`, `packages/moa/README.en.md`, `packages/storybook/i18n/{ko.ts,en.ts,t.ts}`, `packages/storybook/.storybook/manager.ts`, `packages/storybook/docs/Intro.en.mdx`
- Rename: `packages/storybook/docs/Intro.mdx` → `Intro.ko.mdx`
- Modify: `README.md`, `packages/moa/README.md`(맨 위 전환 링크), `packages/moa/package.json`(`files`에 `README.en.md` 추가), `packages/storybook/package.json`(스크립트), `packages/storybook/.storybook/main.ts`, `packages/storybook/stories/*.stories.tsx`(설명 문자열 → `t()` 키)

**Interfaces:**
- Produces:
  - `t(key: MessageKey): string`: `import.meta.env.STORYBOOK_LOCALE`(없으면 `"ko"`)에 맞는 사전에서 문구를 꺼낸다. `MessageKey`는 `ko.ts`의 키에서 만든 타입이라, `en.ts`에 키가 빠지면 타입 오류가 난다. 키 형식은 `<name>.description`, `<name>.<story>`다.
  - 스크립트: `dev`(한국어), `dev:en`(`STORYBOOK_LOCALE=en`), `build`(한국어 → `storybook-static/`), `build:en`(영어 → `storybook-static/en/`)
  - `main.ts`의 `stories`는 `"../docs/*.<locale>.mdx"`로 언어에 맞는 MDX만 불러온다.
  - `manager.ts`: 툴바에 `한국어 ↔ English` 링크 하나를 둔다. 한국어 빌드는 `./en/`로, 영어 빌드는 `../`로 이동한다.
  - 루트 `build`와 CI `check` job은 `build:en`도 실행한다. Chromatic에는 한국어 빌드만 올린다. 부품 화면은 언어와 무관해서 영어 빌드까지 올리면 스냅샷만 두 배가 된다.

- 번역은 설명 문구만 한다. 사이드바 제목, 스토리 이름, args·prop 이름은 바꾸지 않는다.
- 툴바 global로 언어를 바꾸는 방식은 쓰지 않는다. Docs 설명과 MDX가 바뀌지 않아 두 언어가 섞이기 때문이다.

- [ ] **MOA-6.1: 스토리 파일의 한국어 설명을 `ko.ts`로 옮기고 `t()` 키로 바꾼다**

Run: `pnpm --filter @dusunax/moa-storybook build`
Expected: 한국어 빌드의 설명이 옮기기 전과 같다.

- [ ] **MOA-6.2: `en.ts`를 채우고 타입 검사로 빠진 키가 없는지 확인한다**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **MOA-6.3: `Intro.en.mdx`, 스크립트, `main.ts`, `manager.ts`를 작성하고 두 언어를 빌드한다**

Run: `pnpm --filter @dusunax/moa-storybook build && pnpm --filter @dusunax/moa-storybook build:en`
Expected: `storybook-static/index.html`과 `storybook-static/en/index.html`이 생긴다. 소개 페이지가 각각 한국어와 영어로 나오고, 툴바 링크로 서로 오갈 수 있다.

- [ ] **MOA-6.4: README 영어판을 쓴다**

  `README.md`와 `README.en.md`, `packages/moa/README.md`와 `README.en.md`를 짝으로 둔다. 각 파일 맨 위에 `한국어 | English` 전환 링크를 둔다. `packages/moa`의 링크는 상대 경로가 npm 페이지에서 깨지므로 GitHub 절대 URL로 건다. 이후 README를 고치면 두 언어를 같은 커밋에서 고친다.

Run: `pnpm --filter @dusunax/moa pack --dry-run`
Expected: `README.en.md`가 포함된다.

- [ ] **MOA-6.5: 커밋한다** — `docs(storybook): 설명 문구를 사전으로 옮기고 영어 빌드 추가`, `docs: README 영어판 추가`
