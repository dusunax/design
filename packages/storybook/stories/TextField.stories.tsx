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
        component: "`variant`는 shortText, longText, number, obscured다. 오류는 `invalid`로 표시하고, 네이티브 검증(`:user-invalid`)에 걸려도 같은 모습이 된다. `onChange`는 입력값 문자열을 넘기고, 숫자 입력을 비우면 빈 문자열이다.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 320 }}>
      <TextField label="shortText" placeholder="홍길동" />
      <TextField label="longText" variant="longText" />
      <TextField label="number" variant="number" placeholder="0" />
      <TextField label="obscured" variant="obscured" />
      <TextField label="disabled" disabled defaultValue="수정할 수 없음" />
      <TextField label="invalid" invalid defaultValue="이미 쓰고 있는 이름" />
    </div>
  ),
};
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
