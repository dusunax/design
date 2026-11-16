import { MessageBubble, RunStatus, StreamingText } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { t } from "../i18n/t";

// 타이머 없이 args로 상태를 고정한 대화 스냅샷이다.
function Conversation({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <MessageBubble role="system">{t("sample.conversationStarted")}</MessageBubble>
      <MessageBubble role="user">{t("sample.question")}</MessageBubble>
      <MessageBubble role="assistant">
        <StreamingText text={text} streaming={streaming} />
      </MessageBubble>
      <RunStatus status={streaming ? "running" : "finished"} />
    </div>
  );
}

const meta: Meta<typeof Conversation> = {
  title: "Agent/Conversation",
  component: Conversation,
  args: { text: t("sample.writingAnswer"), streaming: true },
};
export default meta;
type Story = StoryObj<typeof Conversation>;

export const Streaming: Story = {};
export const Finished: Story = { args: { text: t("sample.answerDone"), streaming: false } };
