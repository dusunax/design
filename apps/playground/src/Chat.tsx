import { MessageBubble, RunStatus, StreamingText, ToolCallCard } from "@dusunax/moa";
import { type MoaAction, MoaSurfaces } from "@dusunax/moa-render";
import type { StreamState } from "@dusunax/moa-stream";

/** messages를 차례로 그린다. activityType이 moa-ui인 activity 메시지는 MoaSurfaces로 그린다(DOC-7 "앱"). */
export function Chat({ state, onAction }: { state: StreamState; onAction: (messageId: string, action: MoaAction) => void }) {
  const last = state.messages.at(-1);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {state.messages.map((m) => {
        if (m.role === "activity") {
          return m.activityType === "moa-ui" ? (
            <MoaSurfaces key={m.id} messages={m.content.messages} onAction={(action) => onAction(m.id, action)} />
          ) : null;
        }
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
      <RunStatus status={state.runStatus} message={state.error?.message} />
    </div>
  );
}
