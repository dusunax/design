import { TextField } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "라벨", placeholder: "입력값", variant: "shortText" },
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
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code='variant="shortText" (기본값)' stretch>
        <TextField label="라벨" defaultValue="입력값" />
      </Prop>
      <Prop code='variant="longText"' stretch>
        <TextField label="라벨" variant="longText" defaultValue={"여러 줄 입력값\n두 번째 줄"} />
      </Prop>
      <Prop code='variant="number"' stretch>
        <TextField label="라벨" variant="number" defaultValue="42" />
      </Prop>
      <Prop code='variant="obscured"' stretch>
        <TextField label="비밀번호" variant="obscured" defaultValue="secret123" />
      </Prop>
      <Prop code="disabled" stretch>
        <TextField label="라벨" disabled defaultValue="입력값" />
      </Prop>
      <Prop code="invalid" stretch>
        <TextField label="라벨" invalid defaultValue="입력값" />
      </Prop>
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
