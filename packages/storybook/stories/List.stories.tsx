import { List } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";

const meta: Meta<typeof List> = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
  args: { direction: "vertical", align: "stretch" },
  render: (args) => (
    <List {...args}>
      <SampleBox label="A" />
      <SampleBox label="B" />
      <SampleBox label="C" />
    </List>
  ),
  parameters: {
    docs: { description: { component: "`<ul>`로 그리고 자식을 하나씩 `<li>`로 감싼다. `direction`으로 방향을 정한다." } },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <PropGrid min={240}>
      <Prop code='direction="vertical" (기본값)'>
        <List>
          <SampleBox label="A" />
          <SampleBox label="B" />
          <SampleBox label="C" />
        </List>
      </Prop>
      <Prop code='direction="horizontal"'>
        <List direction="horizontal">
          <SampleBox label="A" />
          <SampleBox label="B" />
          <SampleBox label="C" />
        </List>
      </Prop>
    </PropGrid>
  ),
};
