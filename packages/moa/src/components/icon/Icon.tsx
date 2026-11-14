import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { BRAND_ICON_PATHS, type BrandIconName } from "./brand";
import type { IconName } from "./names";
import { ICON_PATHS } from "./paths";

export type IconProps = BaseProps & {
  /** catalog 아이콘 이름, moa 전용 이름(`"moa"`), 또는 viewBox `0 -960 960 960` 기준 `{ svgPath }` */
  name: IconName | BrandIconName | { svgPath: string };
  /** px */
  size?: number;
  /** 없으면 장식용(aria-hidden)으로 렌더링한다. */
  label?: string;
};

const PATHS: Record<IconName | BrandIconName, string> = { ...ICON_PATHS, ...BRAND_ICON_PATHS };

export function Icon({ name, size = 24, label, weight, className }: IconProps): JSX.Element {
  const d = typeof name === "string" ? PATHS[name] : name.svgPath;
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      className={clsx("moa:shrink-0", className)}
      style={weightStyle(weight)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path d={d} />
    </svg>
  );
}
