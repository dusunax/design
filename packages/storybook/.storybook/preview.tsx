import type { Preview } from "@storybook/react-vite";
import "@dusunax/moa/styles.css";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "moa 테마",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, { globals }) => (
      <div
        data-moa-theme={globals.theme}
        style={{ background: "var(--moa-color-bg)", color: "var(--moa-color-fg)", padding: 24 }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
