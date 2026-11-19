---
id: DOC-5
type: spec
title: moa design system
description: >
  Sets the purpose, package layout, styling, components, and build and release decisions of moa, a lightweight component design system for an AG-UI PoC, with the reasons behind them.
  Read it to learn what is being built and why, or to check the reasons behind a plan.
---

[한국어](2026-11-14-moa-design.md) | English

# moa design system

## Purpose

Rebuild the `dusunax/design` repository into **moa, a lightweight component design system** that supports an AG-UI PoC. moa is the Korean "모아" (gather): gather components to build a screen.

There are three goals.

1. Clean up the existing repository.
2. Build a design system with only the minimum set of components.
3. Support an AG-UI PoC.

The deciding criterion is **keeping bundle size and dependencies minimal**.

## Package layout

A pnpm workspace monorepo. The root holds only workspace configuration.

| Path | Package | Published | Role | Work ID |
|---|---|---|---|---|
| `packages/moa` | `@dusunax/moa` | npm | Presentational components. Knows no protocol | MOA-1\~MOA-7 |
| `packages/storybook` | `@dusunax/moa-storybook` | private | Docs, Chromatic | MOA-1\~MOA-6 |
| `packages/moa-render` | `@dusunax/moa-render` | npm | Renders UI specs sent by an agent as moa components | Set in DOC-7, DOC-8 |
| `packages/moa-stream` | `@dusunax/moa-stream` | npm | Hooks that turn an agent event stream (AG-UI) into UI state | Set in DOC-7, DOC-8 |
| `apps/playground` | — | private | PoC connected to a real agent | Set in DOC-7, DOC-8 |

`moa-render`, `moa-stream`, and the playground are detailed in DOC-7 (spec) and DOC-8 (plan). Inputs for that work: `moa-stream` covers hooks based on `@ag-ui/client@1.0.4` and stories that replay event fixtures; the playground uses only OpenRouter `:free` models. Work order and status are in DOC-3.

**Naming rules**

- Package names do not include "A2UI" or "AG-UI", so they are not mistaken for official implementations. Compatibility targets appear only in README descriptions.
- Generic names under the `@dusunax/` scope (such as `agent`) are left for other projects. Every package in this system uses the `moa` prefix.

### Package boundaries

`moa-render` and `moa-stream` cover different axes. `moa-stream` handles how to talk to the agent; `moa-render` handles what to draw on screen.

| | `moa-stream` | `moa-render` |
|---|---|---|
| Input | AG-UI events (`RUN_*`, `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_*`) | UI spec (a list of components referencing each other by id, a data model, actions) |
| Output | State: `messages`, `toolCalls`, `runStatus`, `state` | A moa component tree |
| Knows | The AG-UI protocol, transport | The moa catalog, the spec format |
| Does not know | Screen layout | How the spec arrived |
| Core | An `events → state` reducer and a hook around it | A pure `spec → tree` function and a component around it |

**Data flow**

```
agent ─AG-UI events→ moa-stream ─messages·toolCalls·runStatus→ MessageBubble, StreamingText, RunStatus, ToolCallCard
                          │
                          └─state.ui→ moa-render ─→ Row, Card, Button, TextField …
                                          │
                moa-stream sends to agent ←─onAction
```

**Rules**

- The two packages do not depend on each other. The consuming app (`apps/playground`) connects them.
- `moa` knows neither package. Its public API exposes no AG-UI or spec types.
- `moa-render` depends only on `moa`. `moa-stream` depends on `@ag-ui/client` and not on `moa`.

**Why split them**

1. They are used separately. Chat alone needs only `moa-stream`. When UI specs arrive by a path other than AG-UI (MCP tool results, a server API, fixed JSON), only `moa-render` is needed.
2. Their dependency sizes differ. `@ag-ui/client` and its dependencies are not forced on code that only draws specs.
3. They change for different reasons. `moa-stream` changes with the AG-UI spec; `moa-render` changes with the spec format or catalog. Versions are bumped separately.
4. Tests stay simple. Event array → state and spec → DOM are each verified without network mocks.

## Cleaning up the existing repository

The multi-touch example, Next.js configuration, and unused dependencies are removed. The last state is kept as the `legacy/multi-touch` tag.

## Styling

- Development uses Tailwind CSS v4 with `prefix(moa)`, so utilities look like `moa:flex` and theme variables like `--moa-*`.
- The published output is **a single compiled plain CSS file** (`@dusunax/moa/styles.css`). Consumers do not need Tailwind.
- Tailwind preflight (global reset) is not included in the published CSS, because it must not change the consumer's page.
- Tokens are defined in `@theme`. Dark mode overrides variables under the `[data-moa-theme="dark"]` selector.
- `tailwind-merge` is not used (size). Classes are combined with `clsx` and variants with `class-variance-authority`.

## Brand concept

The mascot is a teal slime with a sprout. It stands for small components gathering to grow a screen.

- 16×16 grid source: [`moa-mascot-16.svg`](../assets/moa-mascot-16.svg) (32px and below)
- 32×32 grid source: [`moa-mascot-32.svg`](../assets/moa-mascot-32.svg) (above 32px)
- Used for: logo, favicon, empty-state illustrations (not in component text, stories, or doc prose)

## Components

### Borrowing the A2UI philosophy

The A2UI v1.0 basic catalog is not implemented directly; only its philosophy is borrowed.

1. Allowlist (catalog): the agent draws only registered components.
2. Flat list + id references: stream and update in fragments. (Handled in `moa-render`)
3. Structure separate from the data model: values bind by path. (Handled in `moa-render`)
4. Semantic hints, not styles: `variant` says only what something is.
5. An action is an event that goes back to the agent.

`moa` **component names, prop names, and variant values match the catalog**, so `moa-render` can map them 1:1 later. Defaults may differ (Image `fit` is `fill` in the catalog, `cover` in moa). In that case `moa-render` passes the catalog default itself when the spec has no value. The public API follows React conventions (`children`, `onChange`, `onClick`).

### Built directly (native elements)

Text, Image, Icon, Row, Column, List, Card, Divider, Button, TextField, CheckBox, DateTimeInput

- Text supports only simple Markdown (bold, italic, inline code, links, line breaks). It does not render HTML.
- CheckBox is a native checkbox with `appearance: none`.
- DateTimeInput uses native `date`/`time`/`datetime-local` inputs.
- Icon ships SVG paths only for the 59 names in the catalog. The source is Material Symbols (Apache-2.0). Custom icons as `{ svgPath }` are also accepted.
- Video and AudioPlayer are out of scope for MOA-1\~MOA-6.

### Radix wrappers

| Component | Radix package |
|---|---|
| Modal | `@radix-ui/react-dialog` |
| Tabs | `@radix-ui/react-tabs` |
| Slider | `@radix-ui/react-slider` |
| ChoicePicker (single choice + `checkbox`) | `@radix-ui/react-radio-group` |
| ChoicePicker (`chips`) | `@radix-ui/react-toggle-group` |

- Why Radix: measured size for the same 5 components is 36.2KB with Radix and 60.8KB with Base UI 1.9.0 (gzip).
- Radix types and props are not exposed in the public API, so it can be replaced later.
- ChoicePicker's `multipleSelection` + `checkbox` combination is built from moa CheckBox. `filterable` is implemented directly with a search input.

### Agent-specific components

Not in the catalog, but needed to show AG-UI events on screen.

| Component | Role | Implementation |
|---|---|---|
| MessageBubble | User and agent messages | Direct |
| StreamingText | Text that grows token by token, with a cursor | Direct |
| RunStatus | Run status (idle, running, done, error) | Direct |
| ToolCallCard | Tool name, arguments, result, status | Native `<details>` |

## Build and release

- Build: `tsdown` produces ESM and `.d.ts`. Each component has a subpath export (`@dusunax/moa/button`).
- Type declarations are generated with `isolatedDeclarations`, to avoid depending on the TypeScript 7 API.
- Versioning and npm releases use changesets.
- size-limit runs in **report mode** (warnings only, no CI failure).

| Target | Budget (gzip) |
|---|---|
| All directly built component JS | 5KB |
| All JS | 40KB |
| One Radix-wrapped component | 15KB |
| `styles.css` | 10KB |

## Storybook and Chromatic

- Storybook 10 + `@storybook/react-vite`
- Light/dark is switched from the toolbar.
- Docs are Korean first, with English alongside. Storybook is built per language (Korean `/`, English `/en/`). Only descriptions are translated; story names and prop names stay in English. READMEs also come in pairs: at the repository root, `README.md` (Korean) and `README.en.md` (English); in `packages/moa`, which npm shows, `README.md` (English) and `README.ko.md` (Korean). English support is done at once in MOA-6.
- Default component UI text is English. `moa` ships no translation dictionary; text is changed through text props.
- Chromatic publishing is set up in MOA-5.
