import { ICON_NAMES, Icon } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "send", size: 24 },
  parameters: {
    docs: {
      description: {
        component:
          "catalog 59개 이름의 SVG path를 내장한다(Material Symbols, Apache-2.0). `label`이 없으면 장식용으로 숨기고, `{ svgPath }`로 직접 그린 아이콘도 받는다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Playground: Story = {};
export const Usage: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "end" }}>
      {[16, 20, 24, 32].map((s) => (
        <Icon key={s} name="star" size={s} />
      ))}
      <Icon name="warning" label="경고" />
      <Icon name={{ svgPath: "M480-80 80-480l400-400 400 400L480-80Z" }} />
    </div>
  ),
  parameters: { docs: { description: { story: "크기 16·20·24·32, label이 있는 아이콘, svgPath로 그린 아이콘" } } },
};
export const All: Story = {
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
