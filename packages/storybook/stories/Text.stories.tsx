import { Text } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Text> = {
  title: "Display/Text",
  component: Text,
  tags: ["autodocs"],
  args: { text: "에이전트가 보낸 **문장**이다.", variant: "body" },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<Text text=\"에이전트가 보낸 응답 본문이다.\" />\n<Text variant=\"caption\" text=\"보조 설명이다.\" />\n<Text text={\"**굵게**, *기울임*, `코드`, [링크](https://example.com)\\n줄바꿈\"} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Prop code={`variant="body" (${t("common.default")})`} use={t("text.body")}>
        <Text text="에이전트가 보낸 응답 본문이다." />
      </Prop>
      <Prop code='variant="caption"' use={t("text.caption")}>
        <Text variant="caption" text="보조 설명이다." />
      </Prop>
      <Prop code='text="**굵게**, *기울임*, `코드`, [링크](…)"' use={t("text.markdown")}>
        <Text text={"**굵게**, *기울임*, `코드`, [링크](https://github.com/dusunax/design)\n줄바꿈"} />
      </Prop>
    </div>
  ),
};
