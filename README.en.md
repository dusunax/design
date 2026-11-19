[한국어](README.md) | English

# moa

Lightweight React components for agent UIs

| Path | Package |
|---|---|
| `packages/moa` | `@dusunax/moa` |
| `packages/storybook` | Component docs (not published) |

```bash
pnpm install
pnpm storybook
```

## Design

- [moa design system](docs/specs/2026-11-14-moa-design.en.md): package layout and boundaries, styling, components
- [AG-UI event for UI specs](docs/decisions/2026-11-19-ui-spec-event.en.md): screens sent by the agent arrive as `ACTIVITY` events (`activityType: "moa-ui"`)
- [ID index](docs/INDEX.en.md): work order and progress
