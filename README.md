한국어 | [English](README.en.md)

# moa

에이전트 UI를 위한 경량 React 부품 모음

| 경로 | 패키지 |
|---|---|
| `packages/moa` | `@dusunax/moa` |
| `packages/storybook` | 부품 문서 (배포 안 함) |

```bash
pnpm install
pnpm storybook
```

## 설계

- [moa 디자인 시스템 설계](docs/specs/2026-11-14-moa-design.md): 패키지 구성과 경계, 스타일링, 부품
- [UI 명세를 실어 보낼 AG-UI 이벤트](docs/decisions/2026-11-19-ui-spec-event.md): 에이전트가 보낸 화면을 `ACTIVITY` 이벤트(`activityType: "moa-ui"`)로 받는 결정
- [ID 목록](docs/INDEX.md): 작업 순서와 진행 상태
