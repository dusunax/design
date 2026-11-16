import { List } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof List> = {
  title: "Layout/List",
  component: List,
  tags: ["autodocs"],
  argTypes: { children: { control: false } },
  args: { direction: "vertical", align: "stretch" },
  render: (args) => (
    <List {...args}>
      <SampleBox label="A" />
      <SampleBox label="B" />
      <SampleBox label="C" />
    </List>
  ),
  parameters: {
    docs: { description: { component: t("list.description") } },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Playground: Story = {};

const H_ALIGN = ["start", "center", "end"] as const;

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: "<List>\n  <span>A</span>\n  <span>B</span>\n</List>\n<List direction=\"horizontal\">…</List>\n<List direction=\"horizontal\" align=\"center\">…</List>",
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Prop code={`direction="vertical" (${t("common.default")})`} use={t("list.vertical")}>
        <List>
          <SampleBox label="A" />
          <SampleBox label="B" />
          <SampleBox label="C" />
        </List>
      </Prop>
      <Prop code='direction="horizontal"' use={t("list.horizontal")}>
        <List direction="horizontal">
          <SampleBox label="항목" />
          <SampleBox label="긴 항목" />
          <SampleBox label="가장 긴 항목" />
        </List>
      </Prop>
      <PropGrid min={200}>
        {H_ALIGN.map((a) => (
          <Prop key={a} code={`align="${a}"`}>
            <List direction="horizontal" align={a}>
              <SampleBox label="높은 항목" tall />
              <SampleBox label="항목" />
            </List>
          </Prop>
        ))}
      </PropGrid>
    </div>
  ),
};
