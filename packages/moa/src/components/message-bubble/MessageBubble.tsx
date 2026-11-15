import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type MessageRole = "user" | "assistant" | "system";

export type MessageBubbleProps = BaseProps & {
  role: MessageRole;
  children: ReactNode;
  /** 스크린리더에만 읽히는 발화자 이름을 바꾼다. 없는 역할은 기본 영어 이름을 쓰고, system은 기본 이름이 없다. */
  labels?: Partial<Record<MessageRole, string>>;
};

const DEFAULT_LABELS: Partial<Record<MessageRole, string>> = { user: "You", assistant: "Assistant" };

const rowClass: Record<MessageRole, string> = {
  user: "moa:justify-end",
  assistant: "moa:justify-start",
  system: "moa:justify-center",
};

const bubbleClass: Record<MessageRole, string> = {
  user: "moa:box-border moa:max-w-[80%] moa:rounded-lg moa:bg-primary moa:px-3 moa:py-2 moa:text-prose moa:wrap-anywhere moa:text-primary-fg",
  assistant: "moa:box-border moa:max-w-[80%] moa:rounded-lg moa:bg-surface moa:px-3 moa:py-2 moa:text-prose moa:wrap-anywhere moa:text-fg",
  system: "moa:text-caption moa:wrap-anywhere moa:text-fg-muted",
};

export function MessageBubble({ role, children, labels, weight, className }: MessageBubbleProps): JSX.Element {
  const label = labels?.[role] ?? DEFAULT_LABELS[role];
  return (
    <div data-role={role} className={clsx("moa:flex", rowClass[role], className)} style={weightStyle(weight)}>
      <div className={bubbleClass[role]}>
        {/* 위치와 색으로만 나뉘는 발화자를 화면을 보지 않는 사용자에게 알린다. 복사할 때는 빠진다 */}
        {label && <span className="moa:sr-only moa:select-none">{label}: </span>}
        {children}
      </div>
    </div>
  );
}
