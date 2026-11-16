import { Column, Divider, Row } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { axis: "horizontal" },
  render: (args) =>
    args.axis === "vertical" ? (
      <Row align="center">
        <span>{t("sample.left")}</span>
        <Divider {...args} />
        <span>{t("sample.right")}</span>
      </Row>
    ) : (
      <Column>
        <span>{t("sample.top")}</span>
        <Divider {...args} />
        <span>{t("sample.bottom")}</span>
      </Column>
    ),
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: `<Column>\n  <span>${t("sample.top")}</span>\n  <Divider />\n  <span>${t("sample.bottom")}</span>\n</Column>\n<Row align="center">\n  <span>${t("sample.left")}</span>\n  <Divider axis="vertical" />\n  <span>${t("sample.right")}</span>\n</Row>`, language: "tsx" } } },
  render: () => (
    <PropGrid min={240}>
      <Prop code={`axis="horizontal" (${t("common.default")})`} use={t("divider.horizontal")}>
        <Column>
          <span>{t("sample.top")}</span>
          <Divider />
          <span>{t("sample.bottom")}</span>
        </Column>
      </Prop>
      <Prop code='axis="vertical"' use={t("divider.vertical")}>
        <Row align="center">
          <span>{t("sample.left")}</span>
          <Divider axis="vertical" />
          <span>{t("sample.right")}</span>
        </Row>
      </Prop>
    </PropGrid>
  ),
};
