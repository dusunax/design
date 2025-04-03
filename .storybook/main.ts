import type { StorybookConfig } from "@storybook/nextjs"
import path from "path"

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
        "@components": path.resolve(__dirname, "../multi-touch/components"),
        "@constants": path.resolve(__dirname, "../multi-touch/constants"),
        "@hooks": path.resolve(__dirname, "../multi-touch/hooks"),
      }
    }
    return config
  },
  staticDirs: ["../public"]
}

export default config

