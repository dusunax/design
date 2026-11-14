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
          "굵게, 기울임, 인라인 코드, 링크, 줄바꿈만 지원한다. HTML은 렌더링하지 않고, 링크는 http·https·mailto만 허용한다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Prop code='variant="body" (기본값)'>
        <Text text="에이전트가 보낸 응답 본문이다." />
      </Prop>
      <Prop code='variant="caption"'>
        <Text variant="caption" text="보조 설명이다." />
      </Prop>
    </div>
  ),
};
export const Markdown: Story = {
  args: { text: "**굵게**, *기울임*, `코드`, [링크](https://github.com/dusunax/design)\n줄바꿈도 된다." },
};
export const DangerousInput: Story = {
  args: { text: "[눌러 보기](javascript:alert(1)) <img src=x onerror=alert(1)>" },
  parameters: {
    docs: { description: { story: "위험한 링크와 HTML은 평문으로 보인다." } },
  },
};
