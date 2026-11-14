import { Column } from "@dusunax/moa";
import type { Align } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";

const meta: Meta<typeof Column> = {
  title: "Components/Column",
  component: Column,
  tags: ["autodocs"],
  args: { justify: "start", align: "stretch" },
  render: (args) => (
    <Column {...args}>
      <SampleBox label="짧음" />
      <SampleBox label="조금 더 긴 항목" />
    </Column>
  ),
  parameters: {
    docs: { description: { component: "자식을 세로로 놓는다. Row와 같은 `justify`, `align`, `weight`를 받는다." } },
  },
};
export default meta;
type Story = StoryObj<typeof Column>;

const ALIGN: Align[] = ["start", "center", "end", "stretch"];

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <PropGrid>
      {ALIGN.map((a) => (
        <Prop key={a} code={`align="${a}"${a === "stretch" ? " (기본값)" : ""}`}>
          <Column align={a}>
            <SampleBox label="짧음" />
            <SampleBox label="조금 더 긴 항목" />
          </Column>
        </Prop>
      ))}
    </PropGrid>
  ),
};
