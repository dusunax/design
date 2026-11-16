import { Card } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { t } from "../i18n/t";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
  args: { children: t("sample.cardContent") },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};
