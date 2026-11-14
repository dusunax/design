---
id: DOC-3
type: index
title: ID 목록
description: >
  모든 ID의 진행 순서, 선행·게이트, 상태, 위치를 담은 단일 기준(SOT)이다.
  다음에 할 ID를 고르거나, 시작해도 되는지 확인하거나, 상태를 갱신할 때 읽는다.
---

# ID 목록

ID의 순서와 상태는 이 문서에만 적는다. 다른 문서는 이 표를 참조만 한다. ID 체계는 DOC-1, 진행 절차와 게이트 확인은 DOC-4에 있다.

## 상시 문서

순서 없이 계속 고쳐 쓰는 문서다. 상태를 두지 않는다.

| ID | 내용 | 위치 |
|---|---|---|
| DOC-1 | 문서 작성 규칙 | `DOC-RULES.md` |
| DOC-2 | 보안 점검 규칙 | `SEC-RULES.md` |
| DOC-3 | ID 목록 (이 문서) | `INDEX.md` |
| DOC-4 | 작업 진행 규칙 | `WORK-RULES.md` |

## 진행 순서

| ID | 종류 | 내용 | 선행 | 게이트 | 상태 | 위치 | PR |
|---|---|---|---|---|---|---|---|
| DOC-5 | spec | moa 디자인 시스템 설계 | — | — | 완료 | `specs/2026-11-14-moa-design.md` | — |
| DOC-6 | plan | MOA-1\~MOA-6 구현 플랜 | DOC-5 | — | 완료 | `plans/2026-11-14-moa-foundation.md` | — |
| SEC-1 | review | 플랜 보안 검토 | DOC-5, DOC-6 | — | 완료 | `reviews/2026-11-14-SEC-1.md` | — |
| MOA-1 | 구현 | init: 레포 정리, 토큰, Storybook | — | SEC-1 | 완료 | 브랜치 `MOA-1`, Step은 DOC-6 | [#1](https://github.com/dusunax/design/pull/1) |
| MOA-2 | 구현 | 기본 부품 | MOA-1 | — | 완료 | 브랜치 `MOA-2`, Step은 DOC-6 | [#2](https://github.com/dusunax/design/pull/2) |
| MOA-3 | 구현 | 의존성 있는 부품 | MOA-2 | — | 완료 | 브랜치 `MOA-3`, Step은 DOC-6 | [#3](https://github.com/dusunax/design/pull/3) |
| MOA-4 | 구현 | 에이전트 부품 | MOA-3 | — | 진행 | 브랜치 `MOA-4`, Step은 DOC-6 | — |
| SEC-2 | review | 구현 코드 보안 점검 (첫 npm 배포 전) | MOA-4 | — | 대기 | — | — |
| MOA-5 | 구현 | 크기 리포트·배포·Chromatic | MOA-4 | SEC-2 | 대기 | 브랜치 `MOA-5`, Step은 DOC-6 | — |
| MOA-6 | 구현 | 문서 영어 지원 | MOA-5 | — | 대기 | 브랜치 `MOA-6`, Step은 DOC-6 | — |
| DOC-7 | spec | 다음 패키지 설계 (`moa-stream`, `moa-render`, playground) | MOA-6 | — | 대기 | — | — |
| DOC-8 | plan | 다음 패키지 구현 플랜 | DOC-7 | — | 대기 | — | — |
| SEC-3 | review | 다음 패키지 설계 보안 점검 | DOC-8 | — | 대기 | — | — |

## 열

| 열 | 값 |
|---|---|
| `ID` | 기본 키 |
| `종류` | DOC·SEC는 문서 `type`, MOA는 `구현` |
| `선행` | 먼저 `완료`가 되어야 하는 ID. 이 표의 `ID`를 참조한다 |
| `게이트` | 통과해야 시작할 수 있는 SEC ID. MOA 행에만 쓴다. SEC가 막는 MOA는 이 열을 거꾸로 읽는다 |
| `상태` | `대기`, `진행`, `완료` |
| `위치` | `docs/` 기준 경로. MOA는 브랜치와 Step이 있는 문서 |
| `PR` | 머지된 PR 링크. MOA에만 쓴다 |

- 행 순서가 진행 순서다. 새 ID는 맞는 자리에 넣는다.
- 상태를 바꾸는 시점은 DOC-4에 있다. 문서를 만들거나 옮기면 같은 커밋에서 `위치`를 고친다.

## 외부 서비스로 옮길 때

지금은 이 문서가 SOT다. 혼자 진행하고, ID가 적고, 에이전트가 게이트를 직접 확인하기 때문이다. 대신 상태는 손으로 갱신하고, 보드와 알림이 없고, 계획이 공개된다.

옮길 신호:

- 이 표에서 merge 충돌이 잦다.
- 상태 갱신이 자주 빠진다.
- 보드, 알림, 비공개 관리가 필요하다.

옮길 때:

- ID와 번호를 이슈 키로 그대로 쓴다.
- `선행`은 의존 링크, `게이트`는 blocks 링크로 옮긴다. `MOA-n.0` 확인은 유지한다.
- SOT는 한 곳만 둔다. 이 문서는 지우거나 링크만 남긴다.
