import { TextField } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { useState } from "react";
import { t } from "../i18n/t";

const meta: Meta<typeof TextField> = {
  title: "Inputs/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: t("sample.label"), placeholder: t("sample.input"), variant: "shortText" },
};
export default meta;
type Story = StoryObj<typeof TextField>;

function ControlledField() {
  const [value, setValue] = useState(t("sample.input"));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <TextField label={t("sample.label")} value={value} onChange={setValue} />
      <code style={{ fontSize: 12 }}>value: {JSON.stringify(value)}</code>
    </div>
  );
}

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: `<TextField label="${t("sample.label")}" defaultValue="${t("sample.input")}" />\n<TextField label="${t("sample.label")}" variant="longText" />\n<TextField label="${t("sample.label")}" variant="number" />\n<TextField label="${t("sample.password")}" variant="obscured" />\n<TextField label="${t("sample.label")}" disabled />\n<TextField label="${t("sample.label")}" invalid />\n\nconst [value, setValue] = useState("");\n<TextField label="${t("sample.label")}" value={value} onChange={setValue} />`, language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code={`variant="shortText" (${t("common.default")})`} use={t("textField.shortText")}>
        <TextField label={t("sample.label")} defaultValue={t("sample.input")} />
      </Prop>
      <Prop code='variant="longText"' use={t("textField.longText")}>
        <TextField label={t("sample.label")} variant="longText" defaultValue={t("sample.multiline")} />
      </Prop>
      <Prop code='variant="number"' use={t("textField.number")}>
        <TextField label={t("sample.label")} variant="number" defaultValue="42" />
      </Prop>
      <Prop code='variant="obscured"' use={t("textField.obscured")}>
        <TextField label={t("sample.password")} variant="obscured" defaultValue="secret123" />
      </Prop>
      <Prop code="disabled">
        <TextField label={t("sample.label")} disabled defaultValue={t("sample.input")} />
      </Prop>
      <Prop code="invalid" use={t("textField.invalid")}>
        <TextField label={t("sample.label")} invalid defaultValue={t("sample.input")} />
      </Prop>
      <Prop code="value + onChange (controlled)">
        <ControlledField />
      </Prop>
    </div>
  ),
};
