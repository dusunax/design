import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const moaSrc = fileURLToPath(new URL("../../moa/src/index.ts", import.meta.url));

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.tsx", "../docs/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "storybook-addon-pseudo-states", "@chromatic-com/storybook"],
  staticDirs: ["../public"],
  // TypeScript 7에는 JS 컴파일러 API가 없어 react-docgen-typescript가 동작하지 않는다. 기본 react-docgen을 쓴다.
  typescript: { reactDocgen: "react-docgen" },
  // 문서 표가 prop 타입·주석을 읽도록 부품은 빌드 결과물 대신 소스를 쓴다. CSS는 빌드된 styles.css를 그대로 쓴다.
  viteFinal: (config) => {
    config.resolve ??= {};
    const alias = Array.isArray(config.resolve.alias) ? config.resolve.alias : [];
    config.resolve.alias = [...alias, { find: /^@dusunax\/moa$/, replacement: moaSrc }];
    return config;
  },
};

export default config;
