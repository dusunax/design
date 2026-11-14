import { TextField } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "이름", placeholder: "홍길동", variant: "shortText" },
  parameters: {
    docs: {
      description: {
        component: "`variant`는 shortText, longText, number, obscured다. `onChange`는 입력값 문자열을 넘기고, 숫자 입력을 비우면 빈 문자열이다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const ShortText: Story = {};
export const LongText: Story = { args: { label: "메모", variant: "longText", placeholder: "" } };
export const NumberInput: Story = { args: { label: "수량", variant: "number", placeholder: "0" } };
export const Obscured: Story = { args: { label: "비밀번호", variant: "obscured", placeholder: "" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "수정할 수 없음" } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <TextField {...args} value={value} onChange={setValue} />
        <code>value: {JSON.stringify(value)}</code>
      </div>
    );
  },
};
