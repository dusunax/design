import { ToolCallCard } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

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
      <Prop code='status="pending"' use={t("toolCallCard.pending")}>
        <ToolCallCard name="search" status="pending" />
      </Prop>
      <Prop code={'status="running" args=\'{"query":"mo\''} use={t("toolCallCard.running")}>
        <ToolCallCard name="search" status="running" args='{"query":"mo' defaultOpen />
      </Prop>
      <Prop code='status="finished" args result' use={t("toolCallCard.finished")}>
        <ToolCallCard name="search" status="finished" args='{"query":"moa"}' result='{"count":3,"items":["a","b","c"]}' defaultOpen />
      </Prop>
      <Prop code='status="error" result="Timeout"'>
        <ToolCallCard name="search" status="error" args='{"query":"moa"}' result="Timeout" defaultOpen />
      </Prop>
      <Prop code={'labels={{ running: "실행 중", args: "인자" }}'} use={t("toolCallCard.labels")}>
        <ToolCallCard name="search" status="running" args='{"query":"moa"}' labels={{ running: "실행 중", args: "인자" }} defaultOpen />
      </Prop>
    </div>
  ),
};
