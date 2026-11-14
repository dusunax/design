import { clsx } from "clsx";
import type { JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type ImageFit = "contain" | "cover" | "fill" | "none" | "scaleDown";
export type ImageVariant = "icon" | "avatar" | "smallFeature" | "mediumFeature" | "largeFeature" | "header";

export type ImageProps = BaseProps & {
  url: string;
  /** 대체 텍스트(alt). 장식용이면 비운다. */
  description?: string;
  fit?: ImageFit;
  variant?: ImageVariant;
};

const fitClass: Record<ImageFit, string> = {
  contain: "moa:object-contain",
  cover: "moa:object-cover",
  fill: "moa:object-fill",
  none: "moa:object-none",
  scaleDown: "moa:object-scale-down",
};

const variantClass: Record<ImageVariant, string> = {
  icon: "moa:size-6",
  avatar: "moa:size-10 moa:rounded-full",
  smallFeature: "moa:size-24 moa:rounded-md",
  mediumFeature: "moa:size-40 moa:rounded-md",
  largeFeature: "moa:size-60 moa:rounded-md",
  header: "moa:h-50 moa:w-full",
};

// catalog 기본값은 fill이지만 비율이 다른 이미지가 찌그러지므로 cover를 기본으로 한다.
export function Image({ url, description, fit = "cover", variant = "mediumFeature", weight, className }: ImageProps): JSX.Element {
  return (
    <img
      src={url}
      alt={description ?? ""}
      loading="lazy"
      className={clsx("moa:block", fitClass[fit], variantClass[variant], className)}
      style={weightStyle(weight)}
    />
  );
}
