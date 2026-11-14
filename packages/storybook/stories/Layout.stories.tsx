import { Card, Column, Divider, List, Row } from "@dusunax/moa";
import type { Justify } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

// 정렬 차이가 잘 보이도록 항목은 강조색으로 채운다.
const Box = ({ label }: { label: string }) => (
  <div
    style={{
      padding: "4px 12px",
      background: "var(--moa-color-primary-subtle)",
      border: "1px solid var(--moa-color-primary)",
      color: "var(--moa-color-primary-text)",
      borderRadius: 4,
    }}
  >
    {label}
  </div>
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
        <Prop key={j} code={`<Row justify="${j}">`}>
          <Row justify={j} weight={1}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Row>
        </Prop>
      ))}
    </Column>
  ),
};

export const ColumnAlign: StoryObj = {
  render: () => (
    <PropGrid>
      {(["start", "center", "end", "stretch"] as const).map((a) => (
        <Prop key={a} code={`<Column align="${a}">`}>
          <Column align={a} weight={1}>
            <Box label="짧음" />
            <Box label="조금 더 긴 항목" />
          </Column>
        </Prop>
      ))}
    </PropGrid>
  ),
};

export const Weight: StoryObj = {
  render: () => (
    <Row>
      <Card weight={1}>
        <code>weight=1</code>
      </Card>
      <Card weight={2}>
        <code>weight=2</code>
      </Card>
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
