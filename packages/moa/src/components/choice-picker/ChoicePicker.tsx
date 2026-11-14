import * as RadioGroup from "@radix-ui/react-radio-group";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { clsx } from "clsx";
import { type JSX, useId, useState } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { CheckBox } from "../check-box";
import { controlHeightClass, fieldInputClass, fieldLabelClass } from "../field";

export type ChoiceOption = { label: string; value: string };

export type ChoicePickerProps = BaseProps & {
  label: string;
  options: ChoiceOption[];
  /** 단일 선택이어도 길이 0\~1인 배열이다(catalog의 DynamicStringList). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  variant?: "multipleSelection" | "mutuallyExclusive";
  displayStyle?: "checkbox" | "chips";
  /** 라벨을 대소문자 구분 없이 부분 일치로 거르는 검색창을 붙인다. 숨겨진 항목의 선택은 유지한다. */
  filterable?: boolean;
  filterPlaceholder?: string;
};

const chipClass =
  "moa:inline-flex moa:h-9 moa:cursor-pointer moa:items-center moa:rounded-full moa:border moa:border-border-strong moa:bg-bg moa:px-3 moa:[font-family:inherit] moa:text-body moa:text-fg moa:hover:bg-surface moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary moa:data-[state=on]:border-primary moa:data-[state=on]:bg-primary-subtle moa:data-[state=on]:text-primary-text";

export function ChoicePicker({
  label,
  options,
  value,
  defaultValue = [],
  onChange,
  variant = "mutuallyExclusive",
  displayStyle = "checkbox",
  filterable,
  filterPlaceholder = "Search",
  weight,
  className,
}: ChoicePickerProps): JSX.Element {
  const id = useId();
  const labelId = `${id}-label`;
  const [inner, setInner] = useState(defaultValue);
  const [query, setQuery] = useState("");
  // 선택 상태는 여기서만 관리하고, 아래 네 렌더러는 표시만 한다.
  const selected = value ?? inner;
  const update = (next: string[]) => {
    setInner(next);
    onChange?.(next);
  };
  const shown = filterable ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const single = variant === "mutuallyExclusive";

  let list: JSX.Element;
  if (single && displayStyle === "checkbox") {
    list = (
      <RadioGroup.Root
        aria-labelledby={labelId}
        value={selected[0] ?? ""}
        onValueChange={(v) => update([v])}
        className="moa:flex moa:flex-col moa:gap-2"
      >
        {shown.map((o) => (
          <div key={o.value} className="moa:inline-flex moa:items-center moa:gap-2">
            <RadioGroup.Item
              id={`${id}-${o.value}`}
              value={o.value}
              className="moa:inline-flex moa:size-4 moa:cursor-pointer moa:items-center moa:justify-center moa:rounded-full moa:border moa:border-border-strong moa:bg-bg moa:p-0 moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary moa:data-[state=checked]:border-primary"
            >
              <RadioGroup.Indicator className="moa:block moa:size-2 moa:rounded-full moa:bg-primary" />
            </RadioGroup.Item>
            <label htmlFor={`${id}-${o.value}`} className="moa:cursor-pointer moa:text-body moa:text-fg">
              {o.label}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
    );
  } else if (displayStyle === "chips") {
    const chips = shown.map((o) => (
      <ToggleGroup.Item key={o.value} value={o.value} className={chipClass}>
        {o.label}
      </ToggleGroup.Item>
    ));
    const groupClass = "moa:flex moa:flex-wrap moa:gap-2";
    // Radix는 toolbar 역할을 붙인다. 항목 성격에 맞게 radiogroup·group으로 바꾼다.
    list = single ? (
      <ToggleGroup.Root type="single" role="radiogroup" aria-labelledby={labelId} value={selected[0] ?? ""} onValueChange={(v) => update(v ? [v] : [])} className={groupClass}>
        {chips}
      </ToggleGroup.Root>
    ) : (
      <ToggleGroup.Root type="multiple" role="group" aria-labelledby={labelId} value={selected} onValueChange={update} className={groupClass}>
        {chips}
      </ToggleGroup.Root>
    );
  } else {
    list = (
      <div role="group" aria-labelledby={labelId} className="moa:flex moa:flex-col moa:gap-2">
        {shown.map((o) => (
          <CheckBox
            key={o.value}
            label={o.label}
            value={selected.includes(o.value)}
            onChange={(checked) => update(checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx("moa:flex moa:flex-col moa:gap-2", className)} style={weightStyle(weight)}>
      <span id={labelId} className={fieldLabelClass}>
        {label}
      </span>
      {filterable && (
        <input
          type="search"
          aria-labelledby={labelId}
          placeholder={filterPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={clsx(fieldInputClass, controlHeightClass)}
        />
      )}
      {list}
    </div>
  );
}
