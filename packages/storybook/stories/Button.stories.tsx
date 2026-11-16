import { Button, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: t("sample.button"), variant: "default" },
  argTypes: {
    disabled: { control: "boolean" },
    type: { control: "inline-radio", options: ["button", "submit", "reset"] },
  },
  parameters: {
    docs: {
      description: {
        component: t("button.description"),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { docs: { source: { code: `<Button>${t("sample.button")}</Button>\n<Button variant="primary">${t("sample.button")}</Button>\n<Button variant="borderless">${t("sample.button")}</Button>\n<Button variant="primary" disabled>${t("sample.button")}</Button>\n<Button variant="primary">\n  <Icon name="send" size={16} />\n  ${t("sample.button")}\n</Button>`, language: "tsx" } } },
  render: () => (
    <PropGrid>
      <Prop code='variant="default"' use={t("button.default")}>
        <Button>{t("sample.button")}</Button>
      </Prop>
      <Prop code='variant="primary"' use={t("button.primary")}>
        <Button variant="primary">{t("sample.button")}</Button>
      </Prop>
      <Prop code='variant="borderless"' use={t("button.borderless")}>
        <Button variant="borderless">{t("sample.button")}</Button>
      </Prop>
      <Prop code="disabled">
        <Button variant="primary" disabled>
          {t("sample.button")}
        </Button>
      </Prop>
      <Prop code={`<Icon name="send" size={16} /> + ${t("button.withIcon")}`}>
        <Button variant="primary">
          <Icon name="send" size={16} />
          {t("sample.button")}
        </Button>
      </Prop>
    </PropGrid>
  ),
};
