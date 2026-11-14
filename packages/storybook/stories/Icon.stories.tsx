import { ICON_NAMES, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";

const meta: Meta<typeof Icon> = {
  title: "Display/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "send", size: 24 },
  parameters: {
    docs: {
      description: {
        component: "글자 없이 아이콘만 쓰면 `label`을 준다. 글자와 함께 쓰면 장식용으로 숨긴다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<Icon name=\"star\" size={16} />\n<Icon name=\"star\" size={20} />\n<Icon name=\"star\" />  {/* 24 */}\n<Icon name=\"star\" size={32} />\n<Icon name=\"warning\" label=\"경고\" />\n<Icon name={{ svgPath: \"M480-80 80-480l400-400 400 400L480-80Z\" }} />", language: "tsx" } } },
  render: () => (
    <PropGrid min={140}>
      {([[16, "버튼, 글자 옆"], [20, "목록 항목"], [24, "단독 (기본값)"], [32, "빈 상태 강조"]] as const).map(([s, use]) => (
        <Prop key={s} code={`size={${s}}`} use={use}>
          <Icon name="star" size={s} />
        </Prop>
      ))}
      <Prop code='label="경고"' use="글자 없이 아이콘만 쓸 때">
        <Icon name="warning" label="경고" />
      </Prop>
      <Prop code="{ svgPath }" use="catalog에 없는 아이콘">
        <Icon name={{ svgPath: "M480-80 80-480l400-400 400 400L480-80Z" }} />
      </Prop>
    </PropGrid>
  ),
};
export const All: Story = {
  parameters: { docs: { source: { code: "import { ICON_NAMES, Icon } from \"@dusunax/moa\";\n\nICON_NAMES.map((name) => <Icon key={name} name={name} />)", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
      {ICON_NAMES.map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <Icon name={n} size={20} />
          <code>{n}</code>
        </div>
      ))}
    </div>
  ),
};
