English | [한국어](https://github.com/dusunax/design/blob/main/packages/moa-render/README.ko.md)

# @dusunax/moa-render

Renders agent UI specs as [moa](https://www.npmjs.com/package/@dusunax/moa) components. It reads a subset of [A2UI](https://a2ui.org) v1.0 messages directly, without the A2UI libraries.

## Install

```bash
pnpm add @dusunax/moa-render @dusunax/moa
```

Requires React 19. `@dusunax/moa`, `react`, and `react-dom` are peer dependencies. Import the moa styles once in your app.

## Usage

```tsx
import "@dusunax/moa/styles.css";
import { MoaSurfaces } from "@dusunax/moa-render";

<MoaSurfaces
  messages={a2uiMessages}
  onAction={(action) => sendToAgent(action)}
  onError={(error) => console.warn(error.code, error.message)}
/>;
```

- `messages` is an array of A2UI v1.0 messages. With `@dusunax/moa-stream`, pass `content.messages` of an `activity` message whose `activityType` is `"moa-ui"`.
- `onAction` receives the same shape as an A2UI v1.0 `action` message, with `context` paths resolved.
- What the user types is kept on top of the data model. A path the user changed keeps the user's value even if the agent sends a new one.

### Server-side checks

`@dusunax/moa-render/core` has no React import. Use it to check a spec on the server with the same rules the renderer uses.

```ts
import { checkSurfaces, toSurfaces } from "@dusunax/moa-render/core";

const { surfaces, errors } = toSurfaces(messages);
const problems = [...errors, ...checkSurfaces(surfaces)]; // root, missing ids, depth, component count
```

## Supported

| A2UI | Support |
|---|---|
| Messages | `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface` |
| Components | Text, Image, Icon, Row, Column, List, Card, Divider, Button, TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Modal, Tabs |
| Values | Literals and `{ "path": "/pointer" }` bindings. Input values bound to a path are two-way |
| Actions | Button `action.event` |

Not supported: function calls, `checks`, `children` templates, `sendDataModel`, Video, AudioPlayer. Unsupported parts render as empty space and are reported through `onError`.

## Security

Specs come from a model, and a model can be steered by prompt injection. The defaults are strict:

| Default | Change it with |
|---|---|
| Images are not loaded, so no request leaves the page | `isAllowedUrl(url, "image")`. Only `https:` URLs reach it |
| Links show their real domain after the text: `docs (example.com)` | `isAllowedUrl(url, "link")` returning `false` turns a link into plain text |
| `obscured` TextField and Modal are not rendered | `allowSensitive` |

Always on:

- Only props in the A2UI catalog reach moa components. Keys like `style`, `className`, `dangerouslySetInnerHTML`, or `on*` are dropped.
- Strings render as text, never as HTML.
- Data model paths containing `__proto__`, `constructor`, or `prototype` are rejected.
- Tree depth is limited to 32 and rendered components to 500 per surface.

Not covered: a plain TextField labeled "Enter your password" looks like any other field. If your agent can be prompted by untrusted content, tell users that cards are generated.

## License

MIT
