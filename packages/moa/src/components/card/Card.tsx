import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type CardProps = BaseProps & { children?: ReactNode };

export function Card({ weight, className, children }: CardProps): JSX.Element {
  return (
    <div
      className={clsx("moa:rounded-lg moa:border moa:border-border moa:bg-surface moa:p-4 moa:text-fg", className)}
      style={weightStyle(weight)}
    >
      {children}
    </div>
  );
}
