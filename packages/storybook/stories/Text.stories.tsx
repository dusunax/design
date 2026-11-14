import { Text } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

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
      <Prop code='variant="body" (기본값)' use="응답 본문">
        <Text text="에이전트가 보낸 응답 본문이다." />
      </Prop>
      <Prop code='variant="caption"' use="출처, 시각 같은 보조 정보">
        <Text variant="caption" text="보조 설명이다." />
      </Prop>
      <Prop code='text="**굵게**, *기울임*, `코드`, [링크](…)"' use="줄바꿈은 \n">
        <Text text={"**굵게**, *기울임*, `코드`, [링크](https://github.com/dusunax/design)\n줄바꿈"} />
      </Prop>
    </div>
  ),
};
