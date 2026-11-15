import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type RunState = "idle" | "running" | "finished" | "error";

export type RunStatusProps = BaseProps & {
  status: RunState;
  /** 상태 옆에 덧붙이는 설명(오류 원인 등) */
  message?: string;
  /** 상태 이름을 바꾼다. 없는 상태는 기본 영어 라벨을 쓴다. */
  labels?: Partial<Record<RunState, string>>;
};

const DEFAULT_LABELS: Record<RunState, string> = { idle: "Idle", running: "Running", finished: "Done", error: "Error" };

const dotClass: Record<RunState, string> = {
  idle: "moa:bg-fg-muted",
  running: "moa:bg-primary moa:animate-pulse moa:motion-reduce:animate-none",
  finished: "moa:bg-success",
  error: "moa:bg-danger",
};

export function RunStatus({ status, message, labels, weight, className }: RunStatusProps): JSX.Element {
  return (
    <div role="status" className={clsx("moa:inline-flex moa:items-center moa:gap-2 moa:text-body moa:text-fg", className)} style={weightStyle(weight)}>
      {/* 글자 모양은 줄 상자 가운데보다 위에 있어서, 점을 1px 올려 글자 가운데에 맞춘다 */}
      <span aria-hidden className={clsx("moa:size-2 moa:shrink-0 moa:-translate-y-px moa:rounded-full", dotClass[status])} />
      <span className="moa:font-medium">{labels?.[status] ?? DEFAULT_LABELS[status]}</span>
      {message && <span className="moa:text-fg-muted">{message}</span>}
    </div>
  );
}
