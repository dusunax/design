import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

// Icon 전체(59개 path)를 끌어오지 않도록 펼침 표시 path만 둔다. 출처: Material Symbols chevron_right, Apache-2.0
const CHEVRON_PATH = "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z";

export type ToolCallState = "pending" | "running" | "finished" | "error";

export type ToolCallCardProps = BaseProps & {
  name: string;
  status: ToolCallState;
  /** 원문 문자열. JSON으로 읽히면 들여 써서, 아니면(스트리밍 중 등) 그대로 보인다. */
  args?: string;
  /** 원문 문자열. error 상태에서는 danger 색으로 보인다. */
  result?: string;
  defaultOpen?: boolean;
};

const LABELS: Record<ToolCallState, string> = { pending: "Pending", running: "Running", finished: "Done", error: "Error" };

// RunStatus와 같은 상태 색을 쓴다.
const badgeClass: Record<ToolCallState, string> = {
  pending: "moa:border-border moa:text-fg-muted",
  running: "moa:border-primary moa:text-primary-text",
  finished: "moa:border-success moa:text-success",
  error: "moa:border-danger moa:text-danger",
};

function pretty(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

const preClass = "moa:m-0 moa:overflow-x-auto moa:rounded-sm moa:bg-surface moa:p-2 moa:font-mono moa:text-caption moa:whitespace-pre-wrap";
const sectionLabelClass = "moa:mb-1 moa:text-caption moa:text-fg-muted";

export function ToolCallCard({ name, status, args, result, defaultOpen, weight, className }: ToolCallCardProps): JSX.Element {
  return (
    <details
      open={defaultOpen}
      className={clsx("moa:group moa:rounded-md moa:border moa:border-border moa:bg-bg moa:text-body moa:text-fg", className)}
      style={weightStyle(weight)}
    >
      <summary className="moa:flex moa:cursor-pointer moa:list-none moa:items-center moa:gap-2 moa:px-3 moa:py-2 moa:focus-visible:outline-2 moa:focus-visible:outline-primary moa:[&::-webkit-details-marker]:hidden">
        <svg viewBox="0 -960 960 960" width={16} height={16} fill="currentColor" aria-hidden className="moa:shrink-0 moa:text-fg-muted moa:transition-transform moa:group-open:rotate-90">
          <path d={CHEVRON_PATH} />
        </svg>
        <code className="moa:font-mono moa:text-body">{name}</code>
        <span className={clsx("moa:ml-auto moa:rounded-full moa:border moa:px-2 moa:text-caption moa:font-medium", badgeClass[status])}>{LABELS[status]}</span>
      </summary>
      {(args || result) && (
        <div className="moa:flex moa:flex-col moa:gap-2 moa:border-t moa:border-border moa:px-3 moa:py-2">
          {args && (
            <div>
              <div className={sectionLabelClass}>Arguments</div>
              <pre className={preClass}>{pretty(args)}</pre>
            </div>
          )}
          {result && (
            <div>
              <div className={sectionLabelClass}>Result</div>
              <pre className={clsx(preClass, status === "error" && "moa:text-danger")}>{status === "error" ? result : pretty(result)}</pre>
            </div>
          )}
        </div>
      )}
    </details>
  );
}
