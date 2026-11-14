import { DateTimeInput } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof DateTimeInput> = {
  title: "Inputs/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
  args: { label: "라벨", enableDate: true },
};
export default meta;
type Story = StoryObj<typeof DateTimeInput>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<DateTimeInput label=\"라벨\" enableDate />\n<DateTimeInput label=\"라벨\" enableTime />\n<DateTimeInput label=\"라벨\" enableDate enableTime />\n<DateTimeInput label=\"라벨\" enableDate min=\"2026-11-01\" max=\"2026-11-30\" />\n<DateTimeInput label=\"라벨\" enableDate invalid />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 280 }}>
      <Prop code="enableDate → date" use="마감일">
        <DateTimeInput label="라벨" enableDate defaultValue="2026-11-14" />
      </Prop>
      <Prop code="enableTime → time" use="알림 시각">
        <DateTimeInput label="라벨" enableTime defaultValue="09:30" />
      </Prop>
      <Prop code="enableDate enableTime → datetime-local" use="일정">
        <DateTimeInput label="라벨" enableDate enableTime defaultValue="2026-11-14T09:30" />
      </Prop>
      <Prop code='min="2026-11-01" max="2026-11-30"'>
        <DateTimeInput label="라벨" enableDate min="2026-11-01" max="2026-11-30" defaultValue="2026-11-14" />
      </Prop>
      <Prop code="invalid">
        <DateTimeInput label="라벨" enableDate invalid defaultValue="2026-12-25" />
      </Prop>
    </div>
  ),
};
