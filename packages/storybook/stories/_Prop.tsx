import type { ReactNode } from "react";

/** 예시는 테두리 상자 안에, 어떤 prop으로 만든 상태인지는 상자 밖 캡션으로 보여 준다. 상자는 항상 칸 너비를 채운다. */
export function Prop({ code, children }: { code: string; children: ReactNode }) {
  return (
    <figure className="story-prop">
      <div className="story-prop-sample">{children}</div>
      <figcaption className="story-prop-code">{code}</figcaption>
    </figure>
  );
}

/** 작은 예시를 같은 너비의 칸으로 나란히 놓는다. */
export function PropGrid({ min = 180, children }: { min?: number; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 16 }}>
      {children}
    </div>
  );
}
