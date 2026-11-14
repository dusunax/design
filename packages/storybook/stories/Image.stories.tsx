import { Image } from "@dusunax/moa";
import type { ImageFit, ImageVariant } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

// Storybook public 폴더의 예시 이미지
const SAMPLE = "/sample.svg";

const meta: Meta<typeof Image> = {
  title: "Display/Image",
  component: Image,
  tags: ["autodocs"],
  args: { url: SAMPLE, description: "예시 이미지" },
};
export default meta;
type Story = StoryObj<typeof Image>;

export const Playground: Story = {};
const VARIANT_USE: Record<ImageVariant, string> = {
  icon: "목록 항목 앞 작은 표시",
  avatar: "사람이나 에이전트 프로필",
  smallFeature: "목록 썸네일",
  mediumFeature: "카드 대표 이미지",
  largeFeature: "단독으로 크게 보여 줄 이미지",
  header: "카드나 화면 상단 배너",
};

const FIT_USE: Record<ImageFit, string> = {
  contain: "로고, 도표처럼 잘리면 안 될 때",
  cover: "사진으로 상자를 꽉 채울 때",
  fill: "비율을 무시하고 늘릴 때 (드묾)",
  none: "원본 크기 그대로",
  scaleDown: "작은 이미지는 원본, 큰 이미지는 줄여서",
};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<Image url={url} description=\"설명\" variant=\"icon\" />\n<Image url={url} description=\"설명\" variant=\"avatar\" />\n<Image url={url} description=\"설명\" variant=\"smallFeature\" />\n<Image url={url} description=\"설명\" />  {/* mediumFeature */}\n<Image url={url} description=\"설명\" variant=\"largeFeature\" />\n<Image url={url} description=\"설명\" variant=\"header\" />", language: "tsx" } } },
  render: (args) => (
    <PropGrid min={280}>
      {(Object.keys(VARIANT_USE) as ImageVariant[]).map((v) => (
        <Prop key={v} code={`variant="${v}"${v === "mediumFeature" ? " (기본값)" : ""}`} use={VARIANT_USE[v]}>
          <Image {...args} variant={v} />
        </Prop>
      ))}
    </PropGrid>
  ),
};

export const Fits: Story = {
  parameters: { docs: { source: { code: "<Image url={url} fit=\"contain\" />\n<Image url={url} />  {/* cover */}\n<Image url={url} fit=\"fill\" />\n<Image url={url} fit=\"none\" />\n<Image url={url} fit=\"scaleDown\" />", language: "tsx" } } },
  render: (args) => (
    <PropGrid min={200}>
      {(Object.keys(FIT_USE) as ImageFit[]).map((f) => (
        <Prop key={f} code={`fit="${f}"${f === "cover" ? " (기본값)" : ""}`} use={FIT_USE[f]}>
          <Image {...args} variant="smallFeature" fit={f} />
        </Prop>
      ))}
    </PropGrid>
  ),
};
