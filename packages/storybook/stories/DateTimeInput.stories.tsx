import { DateTimeInput } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof DateTimeInput> = {
  title: "Inputs/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
  args: { label: t("sample.label"), enableDate: true },
};
export default meta;
type Story = StoryObj<typeof DateTimeInput>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: `<DateTimeInput label="${t("sample.label")}" enableDate />\n<DateTimeInput label="${t("sample.label")}" enableTime />\n<DateTimeInput label="${t("sample.label")}" enableDate enableTime />\n<DateTimeInput label="${t("sample.label")}" enableDate min="2026-11-01" max="2026-11-30" />\n<DateTimeInput label="${t("sample.label")}" enableDate invalid />`, language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 280 }}>
      <Prop code="enableDate → date" use={t("dateTimeInput.date")}>
        <DateTimeInput label={t("sample.label")} enableDate defaultValue="2026-11-14" />
      </Prop>
      <Prop code="enableTime → time" use={t("dateTimeInput.time")}>
        <DateTimeInput label={t("sample.label")} enableTime defaultValue="09:30" />
      </Prop>
      <Prop code="enableDate enableTime → datetime-local" use={t("dateTimeInput.dateTime")}>
        <DateTimeInput label={t("sample.label")} enableDate enableTime defaultValue="2026-11-14T09:30" />
      </Prop>
      <Prop code='min="2026-11-01" max="2026-11-30"'>
        <DateTimeInput label={t("sample.label")} enableDate min="2026-11-01" max="2026-11-30" defaultValue="2026-11-14" />
      </Prop>
      <Prop code="invalid">
        <DateTimeInput label={t("sample.label")} enableDate invalid defaultValue="2026-12-25" />
      </Prop>
    </div>
  ),
};
