---
id: DOC-3
type: index
title: ID index
description: >
  The single source of truth (SOT) for every ID's order, prerequisites and gates, status, and location.
  Read it to pick the next ID, to check whether one may start, or to update a status.
---

[한국어](INDEX.md) | English

# ID index

The Korean [`INDEX.md`](INDEX.md) is the SOT. This English version is updated in the same commit.

ID order and status are written only in this document. Other documents only refer to this table. The ID scheme is in DOC-1; the workflow and gate checks are in DOC-4.

## Living documents

Documents that keep being revised, in no particular order. They have no status.

| ID | Content | Location |
|---|---|---|
| DOC-1 | Documentation rules | `DOC-RULES.md` |
| DOC-2 | Security review rules | `SEC-RULES.md` |
| DOC-3 | ID index (this document) | `INDEX.md` |
| DOC-4 | Workflow rules | `WORK-RULES.md` |

## Order

| ID | Type | Content | Prerequisites | Gate | Status | Location | PR |
|---|---|---|---|---|---|---|---|
| DOC-5 | spec | moa design system | — | — | Done | `specs/2026-11-14-moa-design.md` | — |
| DOC-6 | plan | MOA-1\~MOA-7 implementation plan | DOC-5 | — | Done | `plans/2026-11-14-moa-foundation.md` | — |
| SEC-1 | review | Plan security review | DOC-5, DOC-6 | — | Done | `reviews/2026-11-14-SEC-1.md` | — |
| MOA-1 | Implementation | init: repository cleanup, tokens, Storybook | — | SEC-1 | Done | Branch `MOA-1`, steps in DOC-6 | [#1](https://github.com/dusunax/design/pull/1) |
| MOA-2 | Implementation | Basic components | MOA-1 | — | Done | Branch `MOA-2`, steps in DOC-6 | [#2](https://github.com/dusunax/design/pull/2) |
| MOA-3 | Implementation | Components with dependencies | MOA-2 | — | Done | Branch `MOA-3`, steps in DOC-6 | [#3](https://github.com/dusunax/design/pull/3) |
| MOA-4 | Implementation | Agent components | MOA-3 | — | Done | Branch `MOA-4`, steps in DOC-6 | [#4](https://github.com/dusunax/design/pull/4) |
| SEC-2 | review | Code security review (before the first npm release) | MOA-4 | — | Done | `reviews/2026-11-15-SEC-2.md` | — |
| MOA-5 | Implementation | Size report, release, Chromatic | MOA-4 | SEC-2 | Done | Branch `MOA-5`, steps in DOC-6 | [#5](https://github.com/dusunax/design/pull/5) |
| MOA-6 | Implementation | English docs | MOA-5 | — | Done | Branch `MOA-6`, steps in DOC-6 | [#6](https://github.com/dusunax/design/pull/6) |
| MOA-7 | Implementation | First npm release | MOA-6 | — | Done | Branch `MOA-7`, steps in DOC-6, [`@dusunax/moa@0.1.0`](https://www.npmjs.com/package/@dusunax/moa/v/0.1.0) | [#7](https://github.com/dusunax/design/pull/7) |
| DOC-7 | spec | Agent integration packages (`moa-stream`, `moa-render`, playground) | MOA-6 | — | Done | `specs/2026-11-22-moa-agent-packages-design.md` | — |
| DOC-9 | decision | AG-UI event for UI specs (decided during DOC-7) | — | — | Done | `decisions/2026-11-19-ui-spec-event.md` | — |
| DOC-10 | decision | AG-UI dependency scope of moa-stream (decided during DOC-7) | — | — | Done | `decisions/2026-11-22-moa-stream-agui-dependency.md` | — |
| DOC-11 | decision | Playground deployment and model key (decided during DOC-7) | — | — | Done | `decisions/2026-11-22-playground-deploy-key.md` | — |
| DOC-12 | decision | Playground model choice (decided during DOC-7) | — | — | Done | `decisions/2026-11-22-playground-model.md` | — |
| DOC-13 | decision | `render_ui` tool argument format (decided during DOC-7) | — | — | Done | `decisions/2026-11-22-render-ui-args.md` | — |
| DOC-8 | plan | Agent integration packages implementation plan | DOC-7 | — | Done | `plans/2026-11-22-moa-agent-packages.md` | — |
| SEC-3 | review | Agent integration packages design security review | DOC-8 | — | Done | `reviews/2026-11-22-SEC-3.md` | — |
| MOA-8 | Implementation | `moa-stream` | DOC-8 | SEC-3 | Done | Branch `MOA-8`, steps in DOC-8 | [#8](https://github.com/dusunax/design/pull/8) |
| MOA-9 | Implementation | `moa-render` | DOC-8 | SEC-3 | In progress | Branch `MOA-9`, steps in DOC-8 | — |
| MOA-10 | Implementation | Playground (local) | MOA-8, MOA-9 | SEC-3 | Waiting | Branch `MOA-10`, steps in DOC-8 | — |
| SEC-4 | review | Agent integration packages code security review (before release) | MOA-10 | — | Waiting | — | — |
| MOA-11 | Implementation | `moa-stream`·`moa-render` release and public playground | MOA-10 | SEC-4 | Waiting | Branch `MOA-11`, steps in DOC-8 | — |

## Columns

| Column | Value |
|---|---|
| `ID` | Primary key |
| `Type` | Document `type` for DOC and SEC, `Implementation` for MOA |
| `Prerequisites` | IDs that must be `Done` first. Refers to `ID` in this table |
| `Gate` | SEC ID that must pass before starting. Only on MOA rows. To find the MOA rows a SEC blocks, read this column in reverse |
| `Status` | `Waiting`, `In progress`, `Done` |
| `Location` | Path relative to `docs/`. For MOA, the branch and the document with its steps |
| `PR` | Link to the merged PR. Only for MOA |

- Row order is the work order. New IDs go in the right place.
- When to change a status is in DOC-4. When a document is created or moved, fix `Location` in the same commit.

## Moving to an external service

For now this document is the SOT: work is done by one person, there are few IDs, and the agent checks gates directly. In exchange, statuses are updated by hand, there is no board or notification, and the plan is public.

Signals to move:

- Frequent merge conflicts in this table.
- Status updates are often missed.
- A board, notifications, or private tracking is needed.

When moving:

- Use the IDs and numbers as issue keys as they are.
- Move `Prerequisites` to dependency links and `Gate` to blocks links. Keep the `MOA-n.0` check.
- Keep a single SOT. Delete this document or leave only a link.
