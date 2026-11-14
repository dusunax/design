import type { CSSProperties } from "react";

export type BaseProps = {
  className?: string;
  weight?: number;
};

/** catalog의 `weight`를 flex-grow로 바꾼다. */
export function weightStyle(weight?: number): CSSProperties | undefined {
  return weight === undefined ? undefined : { flexGrow: weight };
}
