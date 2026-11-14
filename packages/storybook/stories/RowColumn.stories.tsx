import { Card, Column, Row } from "@dusunax/moa";
import type { Align, Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";

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
  center: "빈 상태 안내처럼 가운데 둘 때",
  end: "확인·취소 버튼 묶음",
  spaceBetween: "제목과 동작 버튼을 양끝에",
};

const ALIGN_USE: Partial<Record<Align, string>> = {
  start: "길이가 다른 항목을 왼쪽에 맞출 때",
  center: "아이콘과 글자를 가운데 맞출 때",
  stretch: "입력 폼처럼 너비를 채울 때",
};

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: "<Row justify=\"center\">…</Row>\n<Row justify=\"spaceBetween\">…</Row>\n<Column align=\"center\">…</Column>\n\n<Row>\n  <Card weight={1}>…</Card>\n  <Card weight={2}>…</Card>\n</Row>", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        {JUSTIFY.map((j) => (
          <Prop key={j} code={`<Row justify="${j}">${j === "start" ? " (기본값)" : ""}`} use={JUSTIFY_USE[j]}>
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
          <Prop key={a} code={`<Column align="${a}">${a === "stretch" ? " (기본값)" : ""}`} use={ALIGN_USE[a]}>
            <Column align={a}>
              <SampleBox label="짧음" />
              <SampleBox label="조금 더 긴 항목" />
            </Column>
          </Prop>
        ))}
      </PropGrid>
      <Prop code="<Card weight={1}> <Card weight={2}>" use="본문과 사이드처럼 공간을 비율로 나눌 때">
        <Row>
          <Card weight={1}>weight 1</Card>
          <Card weight={2}>weight 2</Card>
        </Row>
      </Prop>
    </div>
  ),
};
