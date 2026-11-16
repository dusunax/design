import { Tabs } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { t } from "../i18n/t";

const meta: Meta<typeof Tabs> = {
  title: "Layout/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    tabs: [
      { title: `${t("sample.tab")} 1`, child: t("sample.firstContent") },
      { title: `${t("sample.tab")} 2`, child: t("sample.secondContent") },
      { title: `${t("sample.tab")} 3`, child: t("sample.thirdContent") },
    ],
    defaultIndex: 0,
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};
