import { TextField } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
  title: "Inputs/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "라벨", placeholder: "입력값", variant: "shortText" },
};
export default meta;
type Story = StoryObj<typeof TextField>;

function ControlledField() {
  const [value, setValue] = useState("입력값");
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <TextField label="라벨" value={value} onChange={setValue} />
      <code style={{ fontSize: 12 }}>value: {JSON.stringify(value)}</code>
    </div>
  );
}

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<TextField label=\"라벨\" defaultValue=\"입력값\" />\n<TextField label=\"라벨\" variant=\"longText\" />\n<TextField label=\"라벨\" variant=\"number\" />\n<TextField label=\"비밀번호\" variant=\"obscured\" />\n<TextField label=\"라벨\" disabled />\n<TextField label=\"라벨\" invalid />\n\nconst [value, setValue] = useState(\"\");\n<TextField label=\"라벨\" value={value} onChange={setValue} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code='variant="shortText" (기본값)' use="이름, 제목처럼 한 줄">
        <TextField label="라벨" defaultValue="입력값" />
      </Prop>
      <Prop code='variant="longText"' use="메모, 설명처럼 여러 줄">
        <TextField label="라벨" variant="longText" defaultValue={"여러 줄 입력값\n두 번째 줄"} />
      </Prop>
      <Prop code='variant="number"' use="수량, 금액">
        <TextField label="라벨" variant="number" defaultValue="42" />
      </Prop>
      <Prop code='variant="obscured"' use="비밀번호, 토큰">
        <TextField label="비밀번호" variant="obscured" defaultValue="secret123" />
      </Prop>
      <Prop code="disabled">
        <TextField label="라벨" disabled defaultValue="입력값" />
      </Prop>
      <Prop code="invalid" use="서버 검증처럼 브라우저가 잡지 못하는 오류">
        <TextField label="라벨" invalid defaultValue="입력값" />
      </Prop>
      <Prop code="value + onChange (controlled)">
        <ControlledField />
      </Prop>
    </div>
  ),
};
