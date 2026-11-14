import { clsx } from "clsx";
import { type JSX, useId } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

// Icon 전체(59개 path)를 끌어오지 않도록 체크 path만 둔다. 출처: Material Symbols check, Apache-2.0
const CHECK_PATH = "M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z";

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
          className="moa:peer moa:m-0 moa:size-4 moa:cursor-pointer moa:appearance-none moa:rounded-sm moa:border moa:border-border-strong moa:bg-bg moa:checked:border-primary moa:checked:bg-primary moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary moa:disabled:cursor-not-allowed moa:disabled:opacity-50"
        />
        <svg
          viewBox="0 -960 960 960"
          width={16}
          height={16}
          fill="currentColor"
          aria-hidden
          className="moa:pointer-events-none moa:absolute moa:inset-0 moa:hidden moa:text-primary-fg moa:peer-checked:block"
        >
          <path d={CHECK_PATH} />
        </svg>
      </span>
      <label htmlFor={id} className="moa:cursor-pointer moa:text-body moa:text-fg">
        {label}
      </label>
    </div>
  );
}
