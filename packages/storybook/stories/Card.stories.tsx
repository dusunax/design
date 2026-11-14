import { Card, Column, Text } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: { children: "카드 내용" },
  parameters: {
    docs: { description: { component: "내용을 테두리로 묶는다. 배경은 채우지 않는다." } },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <PropGrid min={240}>
      <Prop code="children: 글자">
        <Card>카드 내용</Card>
      </Prop>
      <Prop code="children: Column">
        <Card>
          <Column>
            <Text text="**제목**" />
            <Text variant="caption" text="보조 설명" />
          </Column>
        </Card>
      </Prop>
    </PropGrid>
  ),
};
