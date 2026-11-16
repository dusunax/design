import { Text } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Text> = {
  title: "Display/Text",
  component: Text,
  tags: ["autodocs"],
  args: { text: t("sample.textArg"), variant: "body" },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: `<Text text="${t("sample.responseBody")}" />\n<Text variant="caption" text="${t("sample.supporting")}" />\n<Text text={"**${t("sample.bold")}**, *${t("sample.italic")}*, \`${t("sample.code")}\`, [${t("sample.link")}](https://example.com)\\n${t("sample.lineBreak")}"} />`, language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Prop code={`variant="body" (${t("common.default")})`} use={t("text.body")}>
        <Text text={t("sample.responseBody")} />
      </Prop>
      <Prop code='variant="caption"' use={t("text.caption")}>
        <Text variant="caption" text={t("sample.supporting")} />
      </Prop>
      <Prop code={`text="**${t("sample.bold")}**, *${t("sample.italic")}*, \`${t("sample.code")}\`, [${t("sample.link")}](…)"`} use={t("text.markdown")}>
        <Text text={`**${t("sample.bold")}**, *${t("sample.italic")}*, \`${t("sample.code")}\`, [${t("sample.link")}](https://github.com/dusunax/design)\n${t("sample.lineBreak")}`} />
      </Prop>
    </div>
  ),
};
