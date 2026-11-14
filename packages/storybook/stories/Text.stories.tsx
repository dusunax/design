import { Text } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  args: { text: "에이전트가 보낸 **문장**이다.", variant: "body" },
  parameters: {
    docs: {
      description: {
        component:
          "굵게, 기울임, 인라인 코드, 링크, 줄바꿈을 지원한다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Prop code='variant="body" (기본값)'>
        <Text text="에이전트가 보낸 응답 본문이다." />
      </Prop>
      <Prop code='variant="caption"'>
        <Text variant="caption" text="보조 설명이다." />
      </Prop>
      <Prop code="Markdown">
        <Text text={"**굵게**, *기울임*, `코드`, [링크](https://github.com/dusunax/design)\n줄바꿈"} />
      </Prop>
    </div>
  ),
};
