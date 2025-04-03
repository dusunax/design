import type { Preview } from "@storybook/react"
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import "../styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    tags: ["autodocs"],
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone12",
      defaultOrientation: "portrait",
    },
  },
};

export default preview

