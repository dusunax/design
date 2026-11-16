import { Slider } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Slider> = {
  title: "Inputs/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { label: t("sample.label"), max: 100, defaultValue: 40 },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: `<Slider label="${t("sample.label")}" max={100} defaultValue={40} />\n<Slider label="${t("sample.label")}" max={10} steps={5} defaultValue={4} />\n<Slider label="${t("sample.label")}" min={-10} max={10} defaultValue={0} />`, language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code="max={100}" use={t("slider.free")}>
        <Slider label={t("sample.label")} max={100} defaultValue={40} />
      </Prop>
      <Prop code="max={10} steps={5}" use={t("slider.steps")}>
        <Slider label={t("sample.label")} max={10} steps={5} defaultValue={4} />
      </Prop>
      <Prop code="min={-10} max={10}">
        <Slider label={t("sample.label")} min={-10} max={10} defaultValue={0} />
      </Prop>
    </div>
  ),
};
