import type { ReactNode } from "react";

/** 예시는 테두리 상자 안에, 어떤 prop으로 만든 상태인지와 언제 쓰는지는 상자 밖 캡션으로 보여 준다. */
export function Prop({ code, use, children }: { code: string; use?: string; children: ReactNode }) {
  return (
    <figure className="story-prop">
      <div className="story-prop-sample">{children}</div>
      <figcaption>
        <div className="story-prop-code">{code}</div>
        {use && <div className="story-prop-use">{use}</div>}
      </figcaption>
    </figure>
  );
}

/** 작은 예시를 같은 너비의 칸으로 나란히 놓는다. 캡션 줄 수가 달라도 같은 줄의 상자 높이와 캡션 위치가 맞는다. */
export function PropGrid({ min = 180, children }: { min?: number; children: ReactNode }) {
  return (
    <div className="story-prop-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  );
}

/** 정렬 예시에서 쓰는 항목 상자. 정렬 차이가 잘 보이도록 강조색으로 채운다. */
export function SampleBox({ label, tall }: { label: string; tall?: boolean }) {
  return (
    <div
      style={{
        padding: tall ? "16px 12px" : "4px 12px",
        background: "var(--moa-color-primary-subtle)",
        border: "1px solid var(--moa-color-primary)",
        color: "var(--moa-color-primary-text)",
        borderRadius: 4,
      }}
    >
      {label}
    </div>
  );
}
