import { clsx } from "clsx";
import { type JSX, useId } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { Icon } from "../icon/Icon";

export type CheckBoxProps = BaseProps & {
  label: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function CheckBox({ label, value, defaultValue, onChange, disabled, weight, className }: CheckBoxProps): JSX.Element {
  const id = useId();
  return (
    <div className={clsx("moa:inline-flex moa:items-center moa:gap-2", className)} style={weightStyle(weight)}>
      <span className="moa:relative moa:inline-flex moa:size-4">
        <input
          id={id}
          type="checkbox"
          checked={value}
          defaultChecked={defaultValue}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="moa:peer moa:m-0 moa:size-4 moa:cursor-pointer moa:appearance-none moa:rounded-sm moa:border moa:border-border moa:bg-bg moa:checked:border-primary moa:checked:bg-primary moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary moa:disabled:cursor-not-allowed moa:disabled:opacity-50"
        />
        <Icon
          name="check"
          size={16}
          className="moa:pointer-events-none moa:absolute moa:inset-0 moa:hidden moa:text-primary-fg moa:peer-checked:block"
        />
      </span>
      <label htmlFor={id} className="moa:cursor-pointer moa:text-body moa:text-fg">
        {label}
      </label>
    </div>
  );
}
