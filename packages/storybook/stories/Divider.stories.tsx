import { Column, Divider, Row } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { axis: "horizontal" },
  render: (args) =>
    args.axis === "vertical" ? (
      <Row align="center">
        <span>왼쪽</span>
        <Divider {...args} />
        <span>오른쪽</span>
      </Row>
    ) : (
      <Column>
        <span>위</span>
        <Divider {...args} />
        <span>아래</span>
      </Column>
    ),
  parameters: {
    docs: { description: { component: "내용 사이를 선으로 나눈다. `axis`로 방향을 정한다." } },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <PropGrid min={240}>
      <Prop code='axis="horizontal" (기본값)'>
        <Column>
          <span>위</span>
          <Divider />
          <span>아래</span>
        </Column>
      </Prop>
      <Prop code='axis="vertical"'>
        <Row align="center">
          <span>왼쪽</span>
          <Divider axis="vertical" />
          <span>오른쪽</span>
        </Row>
      </Prop>
    </PropGrid>
  ),
};
