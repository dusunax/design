import { CheckBox } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
    <div style={{ display: "grid", gap: 8 }}>
      <CheckBox label="기본" />
      <CheckBox label="체크됨" defaultValue />
      <CheckBox label="비활성" disabled defaultValue />
    </div>
  ),
};
