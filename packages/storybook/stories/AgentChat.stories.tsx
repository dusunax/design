import { MessageBubble, RunStatus, StreamingText, ToolCallCard } from "@dusunax/moa";
import { chat, toolCall, uiCard } from "@dusunax/moa-fixtures";
import { MoaSurfaces } from "@dusunax/moa-render";
import { initialState, reduceEvent } from "@dusunax/moa-stream";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { t } from "../i18n/t";

const events = [...chat, ...toolCall, ...uiCard] as unknown as Parameters<typeof reduceEvent>[1][];

// 타이머 없이 upTo번째 이벤트까지 접은 정적 화면이다.
function AgentChat({ upTo }: { upTo: number }) {
  const state = events.slice(0, upTo).reduce(reduceEvent, initialState);
  const last = state.messages.at(-1);
  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      {state.messages.map((m) => {
        if (m.role === "activity") return m.activityType === "moa-ui" ? <MoaSurfaces key={m.id} messages={m.content.messages} /> : null;
        if (m.role !== "assistant" && m.role !== "user") return null;
        const text = typeof m.content === "string" ? m.content : "";
        return (
          <MessageBubble key={m.id} role={m.role}>
            <StreamingText text={text} streaming={state.runStatus === "running" && m === last} />
          </MessageBubble>
        );
      })}
      {Object.values(state.toolCalls).map((c) => (
        <ToolCallCard key={c.id} name={c.name} status={c.status} args={c.args} result={c.result} />
      ))}
      <RunStatus status={state.runStatus} />
    </div>
  );
}

const meta: Meta<typeof AgentChat> = {
  title: "Agent/Chat",
  component: AgentChat,
  args: { upTo: events.length },
  argTypes: { upTo: { control: { type: "range", min: 0, max: events.length, step: 1 } } },
  parameters: { docs: { description: { component: t("agentChat.description") } } },
};
export default meta;
type Story = StoryObj<typeof AgentChat>;

export const Playground: Story = {};
