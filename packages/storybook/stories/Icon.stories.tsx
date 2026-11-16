import { BRAND_ICON_PATHS, type BrandIconName, ICON_NAMES, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Icon> = {
  title: "Display/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "send", size: 24 },
  parameters: {
    docs: {
      description: {
        component: t("icon.description"),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: `<Icon name="star" size={16} />\n<Icon name="star" size={20} />\n<Icon name="star" />  {/* 24 */}\n<Icon name="star" size={32} />\n<Icon name="warning" label="${t("sample.warning")}" />\n<Icon name="moa" />\n<Icon name={{ svgPath: "M480-80 80-480l400-400 400 400L480-80Z" }} />`, language: "tsx" } } },
  render: () => (
    <PropGrid min={140}>
      {([[16, t("icon.size16")], [20, t("icon.size20")], [24, `${t("icon.size24")} (${t("common.default")})`], [32, t("icon.size32")]] as const).map(([s, use]) => (
        <Prop key={s} code={`size={${s}}`} use={use}>
          <Icon name="star" size={s} />
        </Prop>
      ))}
      <Prop code={`label="${t("sample.warning")}"`} use={t("icon.label")}>
        <Icon name="warning" label={t("sample.warning")} />
      </Prop>
      <Prop code='name="moa"' use={t("icon.brand")}>
        <Icon name="moa" />
      </Prop>
      <Prop code="{ svgPath }" use={t("icon.custom")}>
        <Icon name={{ svgPath: "M480-80 80-480l400-400 400 400L480-80Z" }} />
      </Prop>
    </PropGrid>
  ),
};
export const All: Story = {
  parameters: { docs: { source: { code: `import { BRAND_ICON_PATHS, ICON_NAMES, Icon } from "@dusunax/moa";\n\n// ${t("icon.allComment")}\n[...ICON_NAMES, ...Object.keys(BRAND_ICON_PATHS)].map((name) => <Icon key={name} name={name} />)`, language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
      {[...ICON_NAMES, ...(Object.keys(BRAND_ICON_PATHS) as BrandIconName[])].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <Icon name={n} size={20} />
          <code>{n}</code>
        </div>
      ))}
    </div>
  ),
};
