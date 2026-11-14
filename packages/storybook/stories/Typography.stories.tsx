import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const SIZES = [
  { name: "prose", use: "읽는 본문 (Text body, 메시지)" },
  { name: "body", use: "조작 요소 (버튼, 입력, 라벨)" },
  { name: "caption", use: "보조 설명" },
] as const;

const meta: Meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
};
export default meta;

export const Sizes: StoryObj = {
  parameters: { docs: { source: { code: "font-size: var(--moa-text-prose);\nline-height: var(--moa-text-prose--line-height);", language: "css" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {SIZES.map(({ name, use }) => (
        <Prop key={name} code={`--moa-text-${name} · ${use}`}>
          <p
            style={{
              margin: 0,
              fontSize: `var(--moa-text-${name})`,
              lineHeight: `var(--moa-text-${name}--line-height)`,
            }}
          >
            가나다라마바사 ABCDEFG abcdefg 0123456789
          </p>
        </Prop>
      ))}
    </div>
  ),
};
