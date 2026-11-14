import type { ReactNode } from "react";

/** 예시는 테두리 상자 안에, 어떤 prop으로 만든 상태인지는 상자 밖 캡션으로 보여 준다. */
export function Prop({ code, stretch, children }: { code: string; stretch?: boolean; children: ReactNode }) {
  return (
    <figure className="story-prop" style={{ flex: stretch ? 1 : undefined, justifyItems: stretch ? "stretch" : "start" }}>
      <div className="story-prop-sample" style={{ justifySelf: stretch ? "stretch" : "start" }}>
        {children}
      </div>
      <figcaption className="story-prop-code">{code}</figcaption>
    </figure>
  );
}
