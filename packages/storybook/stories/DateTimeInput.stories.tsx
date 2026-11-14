import { DateTimeInput } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DateTimeInput> = {
  title: "Components/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
  args: { label: "날짜", enableDate: true },
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
    <div style={{ display: "grid", gap: 12, maxWidth: 280 }}>
      <DateTimeInput label="날짜 (date)" enableDate />
      <DateTimeInput label="시간 (time)" enableTime />
      <DateTimeInput label="일시 (datetime-local)" enableDate enableTime />
      <DateTimeInput label="범위 제한 (min/max)" enableDate min="2026-11-01" max="2026-11-30" />
    </div>
  ),
};
