import { Image } from "@dusunax/moa";
import type { ImageFit, ImageVariant } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

// 외부 요청 없이 보이도록 데이터 URL을 쓴다.
const SAMPLE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#12a594"/><circle cx="160" cy="100" r="60" fill="#e0f8f3"/></svg>',
)}`;

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
  args: { url: SAMPLE, description: "예시 이미지" },
  parameters: {
    docs: {
      description: {
        component:
          "`variant`는 크기, `fit`은 맞춤 방식이다. 에이전트가 정한 URL을 그대로 불러오므로 쓰는 쪽에서 CSP `img-src`로 출처를 제한한다(SEC-1.3).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Image>;

export const Playground: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap", maxWidth: 640 }}>
      {(["icon", "avatar", "smallFeature", "mediumFeature", "largeFeature", "header"] as ImageVariant[]).map((v) => (
        <div key={v} style={{ display: "grid", gap: 4, justifyItems: "center" }}>
          <Image {...args} variant={v} fit="cover" />
          <code>{v}</code>
        </div>
      ))}
    </div>
  ),
};
export const Fits: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["contain", "cover", "fill", "none", "scaleDown"] as ImageFit[]).map((f) => (
        <div key={f} style={{ display: "grid", gap: 4 }}>
          <Image {...args} variant="smallFeature" fit={f} className="story-frame" />
          <code>{f}</code>
        </div>
      ))}
    </div>
  ),
};
