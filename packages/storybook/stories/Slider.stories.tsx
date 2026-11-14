import { Slider } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof Slider> = {
  title: "Inputs/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { label: "라벨", max: 100, defaultValue: 40 },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<Slider label=\"라벨\" max={100} defaultValue={40} />\n<Slider label=\"라벨\" max={10} steps={5} defaultValue={4} />\n<Slider label=\"라벨\" min={-10} max={10} defaultValue={0} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code="max={100}" use="값을 자유롭게 고를 때. steps가 없으면 100구간">
        <Slider label="라벨" max={100} defaultValue={40} />
      </Prop>
      <Prop code="max={10} steps={5}" use="정해진 단계만 고를 때">
        <Slider label="라벨" max={10} steps={5} defaultValue={4} />
      </Prop>
      <Prop code="min={-10} max={10}">
        <Slider label="라벨" min={-10} max={10} defaultValue={0} />
      </Prop>
    </div>
  ),
};
