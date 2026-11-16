import { ChoicePicker } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const OPTIONS = [
  { label: `${t("sample.item")} 1`, value: "1" },
  { label: `${t("sample.item")} 2`, value: "2" },
  { label: `${t("sample.item")} 3`, value: "3" },
];
const MANY = Array.from({ length: 8 }, (_, i) => ({ label: `${t("sample.item")} ${i + 1}`, value: String(i + 1) }));

const meta: Meta<typeof ChoicePicker> = {
  title: "Inputs/ChoicePicker",
  component: ChoicePicker,
  tags: ["autodocs"],
  args: { label: t("sample.label"), options: OPTIONS, defaultValue: ["1"] },
};
export default meta;
type Story = StoryObj<typeof ChoicePicker>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ChoicePicker label="${t("sample.label")}" options={options} />\n<ChoicePicker label="${t("sample.label")}" options={options} displayStyle="chips" />\n<ChoicePicker label="${t("sample.label")}" options={options} variant="multipleSelection" />\n<ChoicePicker label="${t("sample.label")}" options={options} variant="multipleSelection" displayStyle="chips" />\n<ChoicePicker label="${t("sample.label")}" options={options} filterable />`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <Prop code={`variant="mutuallyExclusive" (${t("common.default")})`} use={t("choicePicker.single")}>
        <ChoicePicker label={t("sample.label")} options={OPTIONS} defaultValue={["1"]} />
      </Prop>
      <Prop code='displayStyle="chips"' use={t("choicePicker.chips")}>
        <ChoicePicker label={t("sample.label")} options={OPTIONS} displayStyle="chips" defaultValue={["1"]} />
      </Prop>
      <Prop code='variant="multipleSelection"'>
        <ChoicePicker label={t("sample.label")} options={OPTIONS} variant="multipleSelection" defaultValue={["1", "3"]} />
      </Prop>
      <Prop code='variant="multipleSelection" displayStyle="chips"' use={t("choicePicker.multiChips")}>
        <ChoicePicker label={t("sample.label")} options={OPTIONS} variant="multipleSelection" displayStyle="chips" defaultValue={["1", "3"]} />
      </Prop>
      <Prop code="filterable" use={t("choicePicker.filterable")}>
        <ChoicePicker label={t("sample.label")} options={MANY} variant="multipleSelection" filterable defaultValue={["2"]} />
      </Prop>
    </div>
  ),
};
