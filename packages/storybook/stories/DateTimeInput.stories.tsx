import { DateTimeInput } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof DateTimeInput> = {
  title: "Components/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
  args: { label: "라벨", enableDate: true },
  parameters: {
    docs: {
      description: {
        component: "네이티브 date, time, datetime-local 입력을 쓴다. 날짜와 시간을 모두 켜면 datetime-local, 시간만 켜면 time이다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof DateTimeInput>;

export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 280 }}>
      <Prop code="enableDate → date">
        <DateTimeInput label="라벨" enableDate defaultValue="2026-11-14" />
      </Prop>
      <Prop code="enableTime → time">
        <DateTimeInput label="라벨" enableTime defaultValue="09:30" />
      </Prop>
      <Prop code="enableDate enableTime → datetime-local">
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
