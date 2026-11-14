import { CheckBox } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof CheckBox> = {
  title: "Inputs/CheckBox",
  component: CheckBox,
  tags: ["autodocs"],
  args: { label: "라벨" },
};
export default meta;
type Story = StoryObj<typeof CheckBox>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<CheckBox label=\"라벨\" />\n<CheckBox label=\"라벨\" defaultValue />\n<CheckBox label=\"라벨\" disabled />\n<CheckBox label=\"라벨\" disabled defaultValue />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Prop code="(기본)">
        <CheckBox label="라벨" />
      </Prop>
      <Prop code="defaultValue">
        <CheckBox label="라벨" defaultValue />
      </Prop>
      <Prop code="disabled">
        <CheckBox label="라벨" disabled />
      </Prop>
      <Prop code="disabled defaultValue">
        <CheckBox label="라벨" disabled defaultValue />
      </Prop>
    </div>
  ),
};
