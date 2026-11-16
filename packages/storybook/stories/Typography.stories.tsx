import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const SIZES = [
  { name: "prose", use: t("typography.prose") },
  { name: "body", use: t("typography.body") },
  { name: "caption", use: t("typography.caption") },
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
            {t("sample.specimen")}
          </p>
        </Prop>
      ))}
    </div>
  ),
};
