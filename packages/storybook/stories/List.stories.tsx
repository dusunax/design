import { List } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";

const meta: Meta<typeof List> = {
  title: "Layout/List",
  component: List,
  tags: ["autodocs"],
  argTypes: { children: { control: false } },
  args: { direction: "vertical", align: "stretch" },
  render: (args) => (
    <List {...args}>
      <SampleBox label="A" />
      <SampleBox label="B" />
      <SampleBox label="C" />
    </List>
  ),
  parameters: {
    docs: { description: { component: "항목을 나열할 때는 Column 대신 List를 쓴다. 스크린리더가 목록과 항목 수를 읽는다." } },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<List>\n  <span>A</span>\n  <span>B</span>\n</List>\n<List direction=\"horizontal\">…</List>", language: "tsx" } } },
  render: () => (
    <PropGrid min={240}>
      <Prop code='direction="vertical" (기본값)' use="일반 목록">
        <List>
          <SampleBox label="A" />
          <SampleBox label="B" />
          <SampleBox label="C" />
        </List>
      </Prop>
      <Prop code='direction="horizontal"' use="태그, 칩">
        <List direction="horizontal">
          <SampleBox label="A" />
          <SampleBox label="B" />
          <SampleBox label="C" />
        </List>
      </Prop>
    </PropGrid>
  ),
};
