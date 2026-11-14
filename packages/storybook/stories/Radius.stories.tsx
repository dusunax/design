import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const RADII = [
  { name: "sm", use: "체크박스, 인라인 코드" },
  { name: "md", use: "버튼, 입력, 카드" },
  { name: "lg", use: "큰 표면" },
] as const;

const meta: Meta = {
  title: "Foundations/Radius",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "둥글기 토큰 3종이다." } } },
};
export default meta;

export const Sizes: StoryObj = {
  render: () => (
    <PropGrid>
      {RADII.map(({ name, use }) => (
        <Prop key={name} code={`--moa-radius-${name} · ${use}`}>
          <div
            style={{
              height: 64,
              border: "1px solid var(--moa-color-border-strong)",
              background: "var(--moa-color-primary-subtle)",
              borderRadius: `var(--moa-radius-${name})`,
            }}
          />
        </Prop>
      ))}
    </PropGrid>
  ),
};
