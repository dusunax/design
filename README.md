# moa

AG-UI 같은 에이전트 UI를 위한 경량 React 부품 모음이다. moa는 한국어 "모아"로, 부품을 모아 화면을 조립한다는 뜻이다.

## 패키지

| 패키지 | 설명 |
|---|---|
| [`@dusunax/moa`](packages/moa) | 부품과 프리픽스 CSS(`--moa-*`). npm에 배포한다 |
| [`@dusunax/moa-storybook`](packages/storybook) | 부품 문서. 배포하지 않는다 |

## 개발

Node 24 이상과 pnpm 12가 필요하다.

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm storybook
```

## 문서

설계, 플랜, 진행 상태는 [`docs/INDEX.md`](docs/INDEX.md)에서 시작한다.
