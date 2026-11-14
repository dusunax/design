import { CheckBox } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof CheckBox> = {
  title: "Components/CheckBox",
  component: CheckBox,
  tags: ["autodocs"],
  args: { label: "약관에 동의" },
  parameters: {
    docs: { description: { component: "네이티브 체크박스에 `appearance: none`을 적용하고 체크 표시는 Icon으로 그린다." } },
  },
};
export default meta;
type Story = StoryObj<typeof CheckBox>;

export const Playground: Story = {};
export const States: Story = {
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
