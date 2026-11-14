import type { ReactNode } from "react";

/** 예시 아래에 어떤 prop으로 만든 상태인지 코드로 보여 준다. */
export function Prop({ code, stretch, children }: { code: string; stretch?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 4, justifyItems: stretch ? "stretch" : "start", flex: stretch ? 1 : undefined }}>
      {children}
      <code style={{ fontSize: 12, color: "var(--moa-color-fg-muted)" }}>{code}</code>
    </div>
  );
}
