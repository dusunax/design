import { Button, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "버튼", variant: "default" },
  argTypes: {
    disabled: { control: "boolean" },
    type: { control: "inline-radio", options: ["button", "submit", "reset"] },
  },
  parameters: {
    docs: {
      description: {
        component: "화면에서 가장 중요한 동작 하나에만 `primary`를 쓴다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<Button>버튼</Button>\n<Button variant=\"primary\">버튼</Button>\n<Button variant=\"borderless\">버튼</Button>\n<Button variant=\"primary\" disabled>버튼</Button>\n<Button variant=\"primary\">\n  <Icon name=\"send\" size={16} />\n  버튼\n</Button>", language: "tsx" } } },
  render: () => (
    <PropGrid>
      <Prop code='variant="default"' use="primary가 아닌 나머지 동작">
        <Button>버튼</Button>
      </Prop>
      <Prop code='variant="primary"' use="화면의 주 동작 하나">
        <Button variant="primary">버튼</Button>
      </Prop>
      <Prop code='variant="borderless"' use="카드나 목록 안의 보조 동작">
        <Button variant="borderless">버튼</Button>
      </Prop>
      <Prop code="disabled">
        <Button variant="primary" disabled>
          버튼
        </Button>
      </Prop>
      <Prop code='<Icon name="send" size={16} /> + 글자'>
        <Button variant="primary">
          <Icon name="send" size={16} />
          버튼
        </Button>
      </Prop>
    </PropGrid>
  ),
};
