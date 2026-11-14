import { clsx } from "clsx";
import { Children, type JSX, type ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { type Align, alignClass } from "../layout";

export type ListProps = BaseProps & {
  direction?: "vertical" | "horizontal";
  /** 항목의 수직 방향 정렬 */
  align?: Align;
  children?: ReactNode;
};

export function List({ direction = "vertical", align = "stretch", weight, className, children }: ListProps): JSX.Element {
  return (
    <ul
      className={clsx(
        "moa:m-0 moa:flex moa:list-none moa:gap-2 moa:p-0",
        direction === "vertical" ? "moa:flex-col" : "moa:flex-row",
        alignClass[align],
        className,
      )}
      style={weightStyle(weight)}
    >
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  );
}
