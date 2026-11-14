import { Column, Divider, Row } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
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
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<Column>\n  <span>위</span>\n  <Divider />\n  <span>아래</span>\n</Column>\n<Row align=\"center\">\n  <span>왼쪽</span>\n  <Divider axis=\"vertical\" />\n  <span>오른쪽</span>\n</Row>", language: "tsx" } } },
  render: () => (
    <PropGrid min={240}>
      <Prop code='axis="horizontal" (기본값)' use="섹션 사이">
        <Column>
          <span>위</span>
          <Divider />
          <span>아래</span>
        </Column>
      </Prop>
      <Prop code='axis="vertical"' use="툴바의 버튼 묶음 사이">
        <Row align="center">
          <span>왼쪽</span>
          <Divider axis="vertical" />
          <span>오른쪽</span>
        </Row>
      </Prop>
    </PropGrid>
  ),
};
