import type { CSSProperties } from "react";

export type BaseProps = {
  className?: string;
  /** 부모 Row·Column 안에서 남는 공간을 나누는 비율(flex-grow) */
  weight?: number;
};

/** catalog의 `weight`를 flex-grow로 바꾼다. */
export function weightStyle(weight?: number): CSSProperties | undefined {
  return weight === undefined ? undefined : { flexGrow: weight };
}
