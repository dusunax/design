import { Tabs } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tabs> = {
  title: "Layout/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    tabs: [
      { title: "탭 1", child: "첫 번째 내용" },
      { title: "탭 2", child: "두 번째 내용" },
      { title: "탭 3", child: "세 번째 내용" },
    ],
    defaultIndex: 0,
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};
