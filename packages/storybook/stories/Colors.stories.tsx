import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { t } from "../i18n/t";

const COLORS = [
  "bg",
  "surface",
  "fg",
  "fg-muted",
  "border",
  "border-strong",
  "primary",
  "primary-hover",
  "primary-fg",
  "primary-subtle",
  "primary-text",
  "danger",
  "success",
  "warning",
  "raised",
  "overlay",
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
  title: "Foundations/Colors",
  tags: ["autodocs"],
};
export default meta;

export const Colors: StoryObj = {
  parameters: { docs: { source: { code: `/* ${t("colors.outside")} */\ncolor: var(--moa-color-fg);\nbackground: var(--moa-color-primary);`, language: "css" } } },
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      {COLORS.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  ),
};
