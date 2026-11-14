import { Card, Column, Divider, List, Row } from "@dusunax/moa";
import type { Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const Box = ({ label }: { label: string }) => (
  <div style={{ padding: "4px 10px", border: "1px dashed var(--moa-color-border)", borderRadius: 4 }}>{label}</div>
);

const meta: Meta = {
  title: "Components/Layout",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Row, Column, List, Card, Divider다. `justify`와 `align`은 catalog 값을 쓰고, `weight`는 flex-grow로 바뀐다.",
      },
    },
  },
};
export default meta;

const JUSTIFY: Justify[] = ["start", "center", "end", "spaceBetween", "spaceAround", "spaceEvenly", "stretch"];

export const RowJustify: StoryObj = {
  render: () => (
    <Column>
      {JUSTIFY.map((j) => (
        <div key={j}>
          <code>{j}</code>
          <Row justify={j} className="story-frame">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Row>
        </div>
      ))}
    </Column>
  ),
};

export const ColumnAlign: StoryObj = {
  render: () => (
    <Row>
      {(["start", "center", "end", "stretch"] as const).map((a) => (
        <Column key={a} align={a} weight={1} className="story-frame">
          <code>{a}</code>
          <Box label="짧음" />
          <Box label="조금 더 긴 항목" />
        </Column>
      ))}
    </Row>
  ),
};

export const Weight: StoryObj = {
  render: () => (
    <Row>
      <Card weight={1}>weight 1</Card>
      <Card weight={2}>weight 2</Card>
    </Row>
  ),
};

export const CardWithList: StoryObj = {
  render: () => (
    <Card>
      <Column>
        <strong>할 일</strong>
        <Divider />
        <List>
          <span>토큰 정하기</span>
          <span>레이아웃 부품 만들기</span>
          <span>Text 부품 만들기</span>
        </List>
      </Column>
    </Card>
  ),
};
