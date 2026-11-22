import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { agentDevPlugin } from "./server/dev-plugin.ts";

const src = (path: string): string => decodeURIComponent(new URL(`../../packages/${path}`, import.meta.url).pathname);

export default defineConfig({
  plugins: [react(), agentDevPlugin()],
  // workspace 패키지는 빌드 없이 소스를 쓴다. moa 스타일만 빌드한 styles.css를 쓴다.
  resolve: {
    alias: [
      { find: /^@dusunax\/moa$/, replacement: src("moa/src/index.ts") },
      { find: /^@dusunax\/moa-render$/, replacement: src("moa-render/src/index.ts") },
      { find: /^@dusunax\/moa-render\/core$/, replacement: src("moa-render/src/core.ts") },
      { find: /^@dusunax\/moa-stream$/, replacement: src("moa-stream/src/index.ts") },
    ],
  },
  server: { port: 5190 },
  test: { environment: "node", globals: true },
});
