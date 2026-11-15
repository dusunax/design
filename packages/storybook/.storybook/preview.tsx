import type { Preview } from "@storybook/react-vite";
import "@dusunax/moa/styles.css";
import "./preview.css";
import isChromatic from "chromatic/isChromatic";

// 커서 깜빡임과 실행 중 점 펄스가 찍히는 순간에 따라 스냅샷이 달라지지 않게 Chromatic에서는 애니메이션을 끈다.
if (isChromatic()) {
  const style = document.createElement("style");
  style.textContent = "* { animation: none !important; }";
  document.head.append(style);
}

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
  parameters: {
    layout: "fullscreen",
    options: {
      // 사이드바 순서: 소개 → 토큰 → 역할별 부품
      storySort: {
        order: ["Intro", "Foundations", ["Colors", "Typography", "Radius"], "Layout", ["Row·Column"], "Display", "Actions", "Inputs", "Agent", ["MessageBubble", "StreamingText", "RunStatus", "ToolCallCard", "Conversation"], "*"],
      },
    },
  },
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
