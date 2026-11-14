import { clsx } from "clsx";
import { type ChangeEvent, type JSX, useId } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { controlHeightClass, fieldInputClass, fieldLabelClass } from "../field";

export type TextFieldVariant = "shortText" | "longText" | "number" | "obscured";

export type TextFieldProps = BaseProps & {
  label: string;
  value?: string;
  defaultValue?: string;
  /** 이벤트가 아니라 입력값 문자열을 넘긴다. 숫자 입력을 비우면 ""이다. */
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: TextFieldVariant;
  disabled?: boolean;
};

const inputType: Record<Exclude<TextFieldVariant, "longText">, { type: string; inputMode?: "decimal" }> = {
  shortText: { type: "text" },
  number: { type: "number", inputMode: "decimal" },
  obscured: { type: "password" },
};

export function TextField({
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  variant = "shortText",
  disabled,
  weight,
  className,
}: TextFieldProps): JSX.Element {
  const id = useId();
  const common = {
    id,
    value,
    defaultValue,
    placeholder,
    disabled,
    className: fieldInputClass,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
  };
  return (
    <div className={clsx("moa:flex moa:flex-col moa:gap-1", className)} style={weightStyle(weight)}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      {variant === "longText" ? <textarea rows={3} {...common} className={clsx(fieldInputClass, "moa:resize-y")} /> : <input {...inputType[variant]} {...common} className={clsx(fieldInputClass, controlHeightClass)} />}
    </div>
  );
}
