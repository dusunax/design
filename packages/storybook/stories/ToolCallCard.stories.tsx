import { ToolCallCard } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const meta: Meta<typeof ToolCallCard> = {
  title: "Agent/ToolCallCard",
  component: ToolCallCard,
  tags: ["autodocs"],
  args: { name: "search", status: "finished", args: '{"query":"moa"}', result: '{"count":3}', defaultOpen: true },
};
export default meta;
type Story = StoryObj<typeof ToolCallCard>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: "<ToolCallCard name=\"search\" status=\"pending\" />\n<ToolCallCard name=\"search\" status=\"running\" args={partialJson} />\n<ToolCallCard name=\"search\" status=\"finished\" args={json} result={json} />\n<ToolCallCard name=\"search\" status=\"error\" result=\"Timeout\" />\n<ToolCallCard name=\"search\" status=\"running\" labels={{ running: \"실행 중\", args: \"인자\" }} />",
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Prop code='status="pending"' use="호출 준비 중, 인자가 아직 없음">
        <ToolCallCard name="search" status="pending" />
      </Prop>
      <Prop code={'status="running" args=\'{"query":"mo\''} use="인자가 스트리밍 중. 끝나지 않은 JSON은 그대로">
        <ToolCallCard name="search" status="running" args='{"query":"mo' defaultOpen />
      </Prop>
      <Prop code='status="finished" args result' use="완료. JSON은 들여 써서">
        <ToolCallCard name="search" status="finished" args='{"query":"moa"}' result='{"count":3,"items":["a","b","c"]}' defaultOpen />
      </Prop>
      <Prop code='status="error" result="Timeout"'>
        <ToolCallCard name="search" status="error" args='{"query":"moa"}' result="Timeout" defaultOpen />
      </Prop>
      <Prop code={'labels={{ running: "실행 중", args: "인자" }}'} use="배지와 절 제목 문구를 바꿀 때">
        <ToolCallCard name="search" status="running" args='{"query":"moa"}' labels={{ running: "실행 중", args: "인자" }} defaultOpen />
      </Prop>
    </div>
  ),
};
