import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type DividerProps = BaseProps & { axis?: "horizontal" | "vertical" };

export function Divider({ axis = "horizontal", weight, className }: DividerProps): JSX.Element {
  return (
    <div
      role="separator"
      aria-orientation={axis}
      className={clsx(
        "moa:shrink-0 moa:bg-border",
        axis === "horizontal" ? "moa:h-px moa:w-full" : "moa:w-px moa:self-stretch",
        className,
      )}
      style={weightStyle(weight)}
    />
  );
}
