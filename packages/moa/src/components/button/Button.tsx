import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import type { ComponentPropsWithRef, JSX } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type ButtonVariant = "default" | "primary" | "borderless";

export type ButtonProps = BaseProps &
  Omit<ComponentPropsWithRef<"button">, "className"> & {
    variant?: ButtonVariant;
  };

const button = cva(
  "moa:inline-flex moa:[font-family:inherit] moa:items-center moa:justify-center moa:gap-1.5 moa:rounded-md moa:px-3 moa:py-1.5 moa:text-body moa:font-medium moa:cursor-pointer moa:transition-colors moa:disabled:cursor-not-allowed moa:disabled:opacity-50 moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary",
  {
    variants: {
      variant: {
        default: "moa:border moa:border-border moa:bg-bg moa:text-fg moa:hover:bg-surface",
        primary: "moa:border moa:border-transparent moa:bg-primary moa:text-primary-fg moa:hover:bg-primary-hover",
        borderless: "moa:border moa:border-transparent moa:bg-transparent moa:text-primary-text moa:hover:bg-primary-subtle",
      },
    },
  },
);

export function Button({ variant = "default", type = "button", weight, className, style, ...rest }: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={clsx(button({ variant }), className)}
      style={{ ...weightStyle(weight), ...style }}
      {...rest}
    />
  );
}
