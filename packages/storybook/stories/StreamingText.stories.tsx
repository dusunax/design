import { StreamingText } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof StreamingText> = {
  title: "Agent/StreamingText",
  component: StreamingText,
  tags: ["autodocs"],
  args: { text: "에이전트가 답을 쓰는 중이다", streaming: true },
};
export default meta;
type Story = StoryObj<typeof StreamingText>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<StreamingText text={text} streaming />\n<StreamingText text={text} streaming={false} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Prop code="streaming" use="토큰이 들어오는 중. 커서가 깜빡임">
        <StreamingText text="에이전트가 답을 쓰는 중이다" streaming />
      </Prop>
      <Prop code="streaming={false}" use="응답이 끝난 뒤">
        <StreamingText text="에이전트가 답을 다 썼다." streaming={false} />
      </Prop>
      <Prop code='text="**굵게" streaming' use="Markdown 문법이 반쯤 들어와도 글자 그대로">
        <StreamingText text="**굵게" streaming />
      </Prop>
    </div>
  ),
};
