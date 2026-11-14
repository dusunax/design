import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { type Align, alignClass, type Justify, justifyClass } from "../layout";

export type ColumnProps = BaseProps & {
  justify?: Justify;
  align?: Align;
  children?: ReactNode;
};

export function Column({ justify = "start", align = "stretch", weight, className, children }: ColumnProps): JSX.Element {
  return (
    <div
      className={clsx("moa:flex moa:flex-col moa:gap-2", justifyClass[justify], alignClass[align], className)}
      style={weightStyle(weight)}
    >
      {children}
    </div>
  );
}
