import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.tsx", "../docs/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@chromatic-com/storybook"],
};

export default config;
