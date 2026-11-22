import type { A2uiComponent } from "./types";

/**
 * 부품별로 moa에 넘길 수 있는 A2UI catalog prop. 여기 없는 키는 모두 버린다(SEC-3.9).
 * moa Button은 나머지 prop을 <button>에 펼쳐 넣으므로, 이 목록 없이 넘기면 명세가 DOM 속성을 정하게 된다.
 * Video, AudioPlayer는 지원하지 않아 목록에 없다.
 */
export const CATALOG: Readonly<Record<string, readonly string[]>> = {
  Text: ["text", "variant", "weight"],
  Image: ["url", "description", "fit", "variant", "weight"],
  Icon: ["name", "weight"],
  Row: ["children", "justify", "align", "weight"],
  Column: ["children", "justify", "align", "weight"],
  List: ["children", "direction", "align", "weight"],
  Card: ["child", "weight"],
  Divider: ["axis", "weight"],
  Button: ["child", "variant", "action", "weight"],
  TextField: ["label", "value", "placeholder", "variant", "weight"],
  CheckBox: ["label", "value", "weight"],
  ChoicePicker: ["label", "options", "value", "variant", "displayStyle", "filterable", "weight"],
  Slider: ["label", "min", "max", "value", "steps", "weight"],
  DateTimeInput: ["label", "value", "enableDate", "enableTime", "min", "max", "weight"],
  Modal: ["trigger", "content", "weight"],
  Tabs: ["tabs", "weight"],
};

/** 허용 목록에 있는 prop만 남긴다. 지원하지 않는 부품이면 undefined */
export function pickProps(c: A2uiComponent): Record<string, unknown> | undefined {
  const allowed = CATALOG[c.component];
  if (!allowed) return undefined;
  return Object.fromEntries(allowed.filter((k) => Object.hasOwn(c, k)).map((k) => [k, c[k]]));
}

/** 피싱에 쓰일 수 있어 allowSensitive일 때만 그리는 부품(SEC-1.7) */
export const isSensitive = (c: A2uiComponent): boolean =>
  c.component === "Modal" || (c.component === "TextField" && c.variant === "obscured");

/** 값이 목록 안에 있으면 그 값, 아니면 undefined. moa 기본값을 쓰게 된다. */
export function oneOf<T extends string>(value: unknown, options: readonly T[]): T | undefined {
  return options.includes(value as T) ? (value as T) : undefined;
}

/** catalog 기본값이 moa와 다른 곳 */
export const CATALOG_DEFAULTS = { imageFit: "fill" } as const;
