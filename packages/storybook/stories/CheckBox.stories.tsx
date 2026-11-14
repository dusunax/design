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

export const Default: Story = {};
export const Checked: Story = { args: { defaultValue: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: true } };
