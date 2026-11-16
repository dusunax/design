import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

const RADII = [
  { name: "sm", use: t("radius.sm") },
  { name: "md", use: t("radius.md") },
  { name: "lg", use: t("radius.lg") },
] as const;

const meta: Meta = {
  title: "Foundations/Radius",
  tags: ["autodocs"],
};
export default meta;

export const Sizes: StoryObj = {
  parameters: { docs: { source: { code: "border-radius: var(--moa-radius-md);", language: "css" } } },
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
