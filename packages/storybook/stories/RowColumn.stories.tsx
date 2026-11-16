import { Card, Column, Row } from "@dusunax/moa";
import type { Align, Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Row> = {
  title: "Layout/Row·Column",
  id: "layout-row-column",
  component: Row,
  subcomponents: { Column },
  tags: ["autodocs"],
  argTypes: { children: { control: false } },
  args: { justify: "start", align: "stretch" },
  render: (args) => (
    <Row {...args}>
      <SampleBox label="A" />
      <SampleBox label="B" />
      <SampleBox label="C" />
    </Row>
  ),
};
export default meta;
type Story = StoryObj<typeof Row>;

const JUSTIFY: Justify[] = ["start", "center", "end", "spaceBetween", "spaceAround", "spaceEvenly", "stretch"];
const ALIGN: Align[] = ["start", "center", "end", "stretch"];

const JUSTIFY_USE: Partial<Record<Justify, string>> = {
  center: t("rowColumn.justify.center"),
  end: t("rowColumn.justify.end"),
  spaceBetween: t("rowColumn.justify.spaceBetween"),
  stretch: t("rowColumn.justify.stretch"),
};

const ALIGN_USE: Partial<Record<Align, string>> = {
  start: t("rowColumn.align.start"),
  center: t("rowColumn.align.center"),
  stretch: t("rowColumn.align.stretch"),
};

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<Row justify=\"center\">…</Row>\n<Row justify=\"spaceBetween\">…</Row>\n<Column align=\"center\">…</Column>\n\n<Row>\n  <Card weight={1}>…</Card>\n  <Card weight={2}>…</Card>\n</Row>", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        {JUSTIFY.map((j) => (
          <Prop key={j} code={`<Row justify="${j}">${j === "start" ? ` (${t("common.default")})` : ""}`} use={JUSTIFY_USE[j]}>
            <Row justify={j}>
              <SampleBox label="A" />
              <SampleBox label="B" />
              <SampleBox label="C" />
            </Row>
          </Prop>
        ))}
      </div>
      <PropGrid>
        {ALIGN.map((a) => (
          <Prop key={a} code={`<Column align="${a}">${a === "stretch" ? ` (${t("common.default")})` : ""}`} use={ALIGN_USE[a]}>
            <Column align={a}>
              <SampleBox label="짧음" />
              <SampleBox label="조금 더 긴 항목" />
            </Column>
          </Prop>
        ))}
      </PropGrid>
      <Prop code="<Card weight={1}> <Card weight={2}>" use={t("rowColumn.weight")}>
        <Row>
          <Card weight={1}>weight 1</Card>
          <Card weight={2}>weight 2</Card>
        </Row>
      </Prop>
    </div>
  ),
};
