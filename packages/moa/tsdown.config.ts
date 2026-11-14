import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: { index: "src/index.ts" },
  format: "esm",
  dts: true,
  fixedExtension: false,
  deps: { neverBundle: [/^react/, /^@radix-ui\//] },
});

export default config;
