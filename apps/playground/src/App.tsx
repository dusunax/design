import { Text } from "@dusunax/moa";
import { replay, uiCard } from "@dusunax/moa-fixtures";
import { useAgentStream } from "@dusunax/moa-stream";
import { useEffect } from "react";
import { Chat } from "./Chat";

type Events = Parameters<ReturnType<typeof useAgentStream>["run"]>[0];

export function App() {
  const { state, run } = useAgentStream();

  // 키가 없을 때 첫 화면은 녹화한 이벤트 재생이다.
  useEffect(() => {
    void run(replay(uiCard as never[], 300) as Events);
  }, [run]);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <Text variant="caption" text="What you type may be logged by the model provider." />
      <Chat state={state} onAction={(messageId, action) => console.log("moaAction", { messageId, action })} />
    </main>
  );
}
