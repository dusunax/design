import type { Message } from "@ag-ui/core";
import { Button, Text, TextField } from "@dusunax/moa";
import { replay, uiCard } from "@dusunax/moa-fixtures";
import type { MoaAction } from "@dusunax/moa-render";
import { type StreamState, sseEvents, useAgentStream } from "@dusunax/moa-stream";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_MODEL } from "../server/model.ts";
import { Chat } from "./Chat";
import { KeyInput } from "./KeyInput";
import { ModelPicker } from "./ModelPicker";

type Events = Parameters<ReturnType<typeof useAgentStream>["run"]>[0];

// 오류 code는 server/handler.ts와 moa-stream sseEvents가 정한다. 모델이 도구를 부르지 않은 경우는 서버가 텍스트로 알린다.
function notice(error: StreamState["error"]): string | undefined {
  const code = error?.code ?? "";
  if (code === "openrouter_402") return "Your OpenRouter account needs credits.";
  if (code.startsWith("openrouter_429")) return "This model is busy. Try another model.";
  if (code === "429") return "Too many requests. Try again in a moment.";
  if (code === "openrouter_401") return "OpenRouter did not accept this key.";
  return undefined;
}

export function App() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const live = apiKey !== "";

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <Text variant="caption" text="What you type may be logged by the model provider." />
      <KeyInput value={apiKey} onChange={setApiKey} />
      {live ? <ModelPicker value={model} onChange={setModel} /> : <Text variant="caption" text="Without a key, this replays a recorded conversation." />}
      {/* 키를 넣으면 재생한 대화를 버리고 새 대화를 시작한다. */}
      {live ? <LiveSession key="live" apiKey={apiKey} model={model} /> : <Replay key="replay" />}
    </main>
  );
}

function Replay() {
  const { state, run } = useAgentStream();

  // 키가 없을 때 첫 화면은 녹화한 이벤트 재생이다.
  useEffect(() => {
    void run(replay(uiCard as never[], 300) as Events);
  }, [run]);

  return <Chat state={state} onAction={(messageId, action) => console.log("moaAction", { messageId, action })} />;
}

function LiveSession({ apiKey, model }: { apiKey: string; model: string }) {
  const { state, run } = useAgentStream();
  const [draft, setDraft] = useState("");
  const threadId = useRef(crypto.randomUUID()).current;

  const send = (newMessages: Message[], forwardedProps: Record<string, unknown> = {}) => {
    const input = {
      threadId,
      runId: crypto.randomUUID(),
      messages: [...state.messages, ...newMessages],
      tools: [],
      context: [],
      forwardedProps: { model, ...forwardedProps },
    };
    const events = sseEvents("/api/agent", {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    void run(events, newMessages);
  };

  const submit = () => {
    const content = draft.trim();
    if (!content || state.runStatus === "running") return;
    setDraft("");
    send([{ id: crypto.randomUUID(), role: "user", content }]);
  };

  const act = (messageId: string, action: MoaAction) => {
    if (state.runStatus !== "running") send([], { moaAction: { messageId, action } });
  };

  const hint = notice(state.error);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Chat state={state} onAction={act} />
      {hint ? <Text text={hint} /> : null}
      <form
        style={{ display: "grid", gap: 8 }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField label="Message" placeholder="Show me a sign up form" value={draft} onChange={setDraft} />
        <Button type="submit" variant="primary" disabled={state.runStatus === "running"}>
          Send
        </Button>
      </form>
    </div>
  );
}
