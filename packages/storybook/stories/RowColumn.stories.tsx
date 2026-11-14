import { Card, Column, Row } from "@dusunax/moa";
import type { Align, Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid, SampleBox } from "./_Prop";

const meta: Meta<typeof Row> = {
  title: "Layout/Row·Column",
  component: Row,
  subcomponents: { Column },
  tags: ["autodocs"],
  args: { justify: "start", align: "stretch" },
  render: (args) => (
    <Row {...args}>
      <SampleBox label="A" />
      <SampleBox label="B" />
      <SampleBox label="C" />
    </Row>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Row는 가로, Column은 세로로 자식을 놓는다. 둘은 같은 prop을 받는다. `justify`는 놓는 방향의 정렬, `align`은 그 수직 방향의 정렬, `weight`는 남는 공간을 나누는 비율이다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Row>;

const JUSTIFY: Justify[] = ["start", "center", "end", "spaceBetween", "spaceAround", "spaceEvenly", "stretch"];
const ALIGN: Align[] = ["start", "center", "end", "stretch"];

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        {JUSTIFY.map((j) => (
          <Prop key={j} code={`<Row justify="${j}">${j === "start" ? " (기본값)" : ""}`}>
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
          <Prop key={a} code={`<Column align="${a}">${a === "stretch" ? " (기본값)" : ""}`}>
            <Column align={a}>
              <SampleBox label="짧음" />
              <SampleBox label="조금 더 긴 항목" />
            </Column>
          </Prop>
        ))}
      </PropGrid>
      <Prop code="자식의 weight={1}, weight={2}">
        <Row>
          <Card weight={1}>weight 1</Card>
          <Card weight={2}>weight 2</Card>
        </Row>
      </Prop>
    </div>
  ),
};
