import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type MessageRole = "user" | "assistant" | "system";

export type MessageBubbleProps = BaseProps & {
  role: MessageRole;
  children: ReactNode;
};

const rowClass: Record<MessageRole, string> = {
  user: "moa:justify-end",
  assistant: "moa:justify-start",
  system: "moa:justify-center",
};

const bubbleClass: Record<MessageRole, string> = {
  user: "moa:max-w-[80%] moa:rounded-lg moa:bg-primary moa:px-3 moa:py-2 moa:text-body moa:text-primary-fg",
  assistant: "moa:max-w-[80%] moa:rounded-lg moa:bg-surface moa:px-3 moa:py-2 moa:text-body moa:text-fg",
  system: "moa:text-caption moa:text-fg-muted",
};

export function MessageBubble({ role, children, weight, className }: MessageBubbleProps): JSX.Element {
  return (
    <div data-role={role} className={clsx("moa:flex", rowClass[role], className)} style={weightStyle(weight)}>
      <div className={bubbleClass[role]}>{children}</div>
    </div>
  );
}
