import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { type Align, alignClass, type Justify, justifyClass } from "../layout";

export type RowProps = BaseProps & {
  justify?: Justify;
  align?: Align;
  children?: ReactNode;
};

export function Row({ justify = "start", align = "stretch", weight, className, children }: RowProps): JSX.Element {
  return (
    <div
      className={clsx("moa:flex moa:flex-row moa:gap-2", justifyClass[justify], alignClass[align], className)}
      style={weightStyle(weight)}
    >
      {children}
    </div>
  );
}
