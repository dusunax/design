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
  // 테마 배경이 캔버스 전체에 깔리도록 Storybook 기본 여백을 없애고 래퍼가 여백을 맡는다.
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, { globals, viewMode }) => (
      <div
        data-moa-theme={globals.theme}
        style={{
          background: "var(--moa-color-bg)",
          color: "var(--moa-color-fg)",
          padding: 24,
          boxSizing: "border-box",
          minHeight: viewMode === "docs" ? undefined : "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
