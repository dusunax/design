import { clsx } from "clsx";
import { type JSX, useId } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { controlHeightClass, fieldInputClass, fieldLabelClass } from "../field";

export type DateTimeInputProps = BaseProps & {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (iso: string) => void;
  enableDate?: boolean;
  enableTime?: boolean;
  min?: string;
  max?: string;
  /** 네이티브 검증으로 잡을 수 없는 오류(서버 검증 등)를 표시한다. */
  invalid?: boolean;
};

function inputType(enableDate?: boolean, enableTime?: boolean): "date" | "time" | "datetime-local" {
  if (enableDate && enableTime) return "datetime-local";
  if (enableTime && !enableDate) return "time";
  return "date";
}

export function DateTimeInput({
  label,
  value,
  defaultValue,
  onChange,
  enableDate,
  enableTime,
  min,
  max,
  invalid,
  weight,
  className,
}: DateTimeInputProps): JSX.Element {
  const id = useId();
  return (
    <div className={clsx("moa:flex moa:flex-col moa:gap-1", className)} style={weightStyle(weight)}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input
        id={id}
        type={inputType(enableDate, enableTime)}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(fieldInputClass, controlHeightClass)}
      />
    </div>
  );
}
