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

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Button>default</Button>
      <Button variant="primary">primary</Button>
      <Button variant="borderless">borderless</Button>
      <Button variant="primary" disabled>
        disabled
      </Button>
      <Button variant="primary">
        <Icon name="send" size={18} />
        아이콘과 함께
      </Button>
    </div>
  ),
};
