import { Card } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
  args: { children: "카드 내용" },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};
