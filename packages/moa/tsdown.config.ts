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
  },
  format: "esm",
  dts: true,
  fixedExtension: false,
  deps: { neverBundle: [/^react/, /^@radix-ui\//] },
});

export default config;
