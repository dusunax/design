import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // CI는 빌드 전에 테스트를 돌린다. moa의 dist 대신 소스를 쓴다.
  resolve: { alias: [{ find: /^@dusunax\/moa$/, replacement: fileURLToPath(new URL("../moa/src/index.ts", import.meta.url)) }] },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
