import { MessageBubble } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof MessageBubble> = {
  title: "Agent/MessageBubble",
  component: MessageBubble,
  tags: ["autodocs"],
  argTypes: { children: { control: "text" } },
  args: { role: "assistant", children: "메시지" },
};
export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<MessageBubble role=\"user\">…</MessageBubble>\n<MessageBubble role=\"assistant\">…</MessageBubble>\n<MessageBubble role=\"system\">…</MessageBubble>", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Prop code='role="user"' use={t("messageBubble.user")}>
        <MessageBubble role="user">사용자 메시지</MessageBubble>
      </Prop>
      <Prop code='role="assistant"' use={t("messageBubble.assistant")}>
        <MessageBubble role="assistant">에이전트 메시지</MessageBubble>
      </Prop>
      <Prop code='role="system"' use={t("messageBubble.system")}>
        <MessageBubble role="system">안내 메시지</MessageBubble>
      </Prop>
    </div>
  ),
};
