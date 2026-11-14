import { MessageBubble, RunStatus, StreamingText } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";

// 타이머 없이 args로 상태를 고정한 대화 스냅샷이다.
function Conversation({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <MessageBubble role="system">대화를 시작했다</MessageBubble>
      <MessageBubble role="user">질문</MessageBubble>
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
  args: { text: "답변을 쓰는 중이다", streaming: true },
};
export default meta;
type Story = StoryObj<typeof Conversation>;

export const Streaming: Story = {};
export const Finished: Story = { args: { text: "답변을 다 썼다.", streaming: false } };
