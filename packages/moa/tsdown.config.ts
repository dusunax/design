import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: {
    index: "src/index.ts",
    row: "src/components/row/index.ts",
    column: "src/components/column/index.ts",
    list: "src/components/list/index.ts",
    card: "src/components/card/index.ts",
    divider: "src/components/divider/index.ts",
    text: "src/components/text/index.ts",
    icon: "src/components/icon/index.ts",
    image: "src/components/image/index.ts",
    button: "src/components/button/index.ts",
    "text-field": "src/components/text-field/index.ts",
    "check-box": "src/components/check-box/index.ts",
    "date-time-input": "src/components/date-time-input/index.ts",
    modal: "src/components/modal/index.ts",
    tabs: "src/components/tabs/index.ts",
    slider: "src/components/slider/index.ts",
    "choice-picker": "src/components/choice-picker/index.ts",
    "message-bubble": "src/components/message-bubble/index.ts",
    "streaming-text": "src/components/streaming-text/index.ts",
    "run-status": "src/components/run-status/index.ts",
    "tool-call-card": "src/components/tool-call-card/index.ts",
  },
  format: "esm",
  dts: true,
  fixedExtension: false,
  deps: { neverBundle: [/^react/, /^@radix-ui\//] },
});

export default config;
