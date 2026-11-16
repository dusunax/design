import { Image } from "@dusunax/moa";
import type { ImageFit, ImageVariant } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

// Storybook public 폴더의 예시 이미지
const SAMPLE = "/sample.svg";

const meta: Meta<typeof Image> = {
  title: "Display/Image",
  component: Image,
  tags: ["autodocs"],
  args: { url: SAMPLE, description: t("sample.image") },
};
export default meta;
type Story = StoryObj<typeof Image>;

export const Playground: Story = {};
const VARIANT_USE: Record<ImageVariant, string> = {
  icon: t("image.variant.icon"),
  avatar: t("image.variant.avatar"),
  smallFeature: t("image.variant.smallFeature"),
  mediumFeature: t("image.variant.mediumFeature"),
  largeFeature: t("image.variant.largeFeature"),
  header: t("image.variant.header"),
};

const FIT_USE: Record<ImageFit, string> = {
  contain: t("image.fit.contain"),
  cover: t("image.fit.cover"),
  fill: t("image.fit.fill"),
  none: t("image.fit.none"),
  scaleDown: t("image.fit.scaleDown"),
};

export const Variants: Story = {
  parameters: { docs: { source: { code: `<Image url={url} description="${t("sample.description")}" variant="icon" />\n<Image url={url} description="${t("sample.description")}" variant="avatar" />\n<Image url={url} description="${t("sample.description")}" variant="smallFeature" />\n<Image url={url} description="${t("sample.description")}" />  {/* mediumFeature */}\n<Image url={url} description="${t("sample.description")}" variant="largeFeature" />\n<Image url={url} description="${t("sample.description")}" variant="header" />`, language: "tsx" } } },
  render: (args) => (
    <PropGrid min={280}>
      {(Object.keys(VARIANT_USE) as ImageVariant[]).map((v) => (
        <Prop key={v} code={`variant="${v}"${v === "mediumFeature" ? ` (${t("common.default")})` : ""}`} use={VARIANT_USE[v]}>
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
        <Prop key={f} code={`fit="${f}"${f === "cover" ? ` (${t("common.default")})` : ""}`} use={FIT_USE[f]}>
          <Image {...args} variant="smallFeature" fit={f} />
        </Prop>
      ))}
    </PropGrid>
  ),
};
