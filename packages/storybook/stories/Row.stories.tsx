import { Card, Row } from "@dusunax/moa";
import type { Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, SampleBox } from "./_Prop";

const meta: Meta<typeof Row> = {
  title: "Components/Row",
  component: Row,
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
    docs: { description: { component: "자식을 가로로 놓는다. `justify`는 가로 정렬, `align`은 세로 정렬, `weight`는 남는 공간을 나누는 비율이다." } },
  },
};
export default meta;
type Story = StoryObj<typeof Row>;

const JUSTIFY: Justify[] = ["start", "center", "end", "spaceBetween", "spaceAround", "spaceEvenly", "stretch"];

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {JUSTIFY.map((j) => (
        <Prop key={j} code={`justify="${j}"${j === "start" ? " (기본값)" : ""}`}>
          <Row justify={j}>
            <SampleBox label="A" />
            <SampleBox label="B" />
            <SampleBox label="C" />
          </Row>
        </Prop>
      ))}
      <Prop code="자식의 weight={1}, weight={2}">
        <Row>
          <Card weight={1}>weight 1</Card>
          <Card weight={2}>weight 2</Card>
        </Row>
      </Prop>
    </div>
  ),
};
