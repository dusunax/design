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
  parameters: {
    docs: { description: { component: "글자 크기 토큰 3종이다. 크기마다 줄 높이가 함께 정해져 있다." } },
  },
};
export default meta;

export const Sizes: StoryObj = {
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
            에이전트가 보낸 응답을 읽는다. The quick brown fox.
          </p>
        </Prop>
      ))}
    </div>
  ),
};
