import { Button, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "버튼", variant: "default" },
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
    <PropGrid>
      <Prop code='variant="default"'>
        <Button>버튼</Button>
      </Prop>
      <Prop code='variant="primary"'>
        <Button variant="primary">버튼</Button>
      </Prop>
      <Prop code='variant="borderless"'>
        <Button variant="borderless">버튼</Button>
      </Prop>
      <Prop code="disabled">
        <Button variant="primary" disabled>
          버튼
        </Button>
      </Prop>
      <Prop code="Icon + 글자">
        <Button variant="primary">
          <Icon name="send" size={16} />
          버튼
        </Button>
      </Prop>
    </PropGrid>
  ),
};
