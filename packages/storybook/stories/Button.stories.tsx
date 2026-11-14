import { Button, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "보내기", variant: "default" },
  parameters: {
    docs: {
      description: {
        component: "`variant`는 default, primary, borderless 세 가지다. `type` 기본값은 `button`이다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Borderless: Story = { args: { variant: "borderless" } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };
export const WithIcon: Story = {
  args: {
    variant: "primary",
    children: (
      <>
        <Icon name="send" size={18} />
        보내기
      </>
    ),
  },
};
