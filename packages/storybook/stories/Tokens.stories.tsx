import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  "bg",
  "surface",
  "fg",
  "fg-muted",
  "border",
  "primary",
  "primary-fg",
  "danger",
  "success",
  "warning",
] as const;

function Swatch({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(`--moa-color-${name}`).trim());
  });
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--moa-radius-md)",
          border: "1px solid var(--moa-color-border)",
          background: `var(--moa-color-${name})`,
        }}
      />
      <code>--moa-color-{name}</code>
      <span style={{ color: "var(--moa-color-fg-muted)" }}>{value}</span>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "moa의 색상 토큰이다. 툴바에서 테마를 dark로 바꾸면 `[data-moa-theme=\"dark\"]` 값으로 바뀐다.",
      },
    },
  },
};
export default meta;

export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      {COLORS.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  ),
};
