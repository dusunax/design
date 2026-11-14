import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { type InlineNode, parseInline } from "./markdown";

export type TextProps = BaseProps & {
  text: string;
  variant?: "body" | "caption";
};

function renderNode(node: InlineNode, key: number): ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "strong":
      return <strong key={key}>{node.value}</strong>;
    case "em":
      return <em key={key}>{node.value}</em>;
    case "code":
      return (
        <code key={key} className="moa:rounded-sm moa:bg-surface moa:px-1 moa:font-mono">
          {node.value}
        </code>
      );
    case "link":
      return (
        <a key={key} href={node.href} target="_blank" rel="noopener noreferrer" className="moa:text-primary-text moa:underline">
          {node.value}
        </a>
      );
    case "br":
      return <br key={key} />;
  }
}

export function Text({ text, variant = "body", weight, className }: TextProps): JSX.Element {
  return (
    <p
      className={clsx(
        "moa:m-0",
        variant === "caption" ? "moa:text-caption moa:text-fg-muted" : "moa:text-body moa:text-fg",
        className,
      )}
      style={weightStyle(weight)}
    >
      {parseInline(text).map(renderNode)}
    </p>
  );
}
