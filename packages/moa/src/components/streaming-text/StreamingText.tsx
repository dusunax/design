import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type StreamingTextProps = BaseProps & {
  text: string;
  /** 토큰이 아직 들어오는 중인지. 켜져 있으면 커서를 보이고 aria-busy를 붙인다. */
  streaming: boolean;
};

// 스트리밍 중 Markdown을 해석하면 문법이 반쯤 들어왔을 때 화면이 깜빡이므로 평문으로 보여 준다.
export function StreamingText({ text, streaming, weight, className }: StreamingTextProps): JSX.Element {
  return (
    <div
      aria-live="polite"
      aria-busy={streaming}
      className={clsx("moa:whitespace-pre-wrap moa:text-prose moa:text-fg", className)}
      style={weightStyle(weight)}
    >
      {text}
      {streaming && (
        <span aria-hidden className="moa:animate-blink moa:text-primary moa:motion-reduce:animate-none">
          ▍
        </span>
      )}
    </div>
  );
}
