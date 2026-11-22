import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: { index: "src/index.ts", core: "src/core.ts" },
  format: "esm",
  dts: true,
  fixedExtension: false,
  deps: { neverBundle: [/^react/, /^@dusunax\/moa/] },
});

export default config;
