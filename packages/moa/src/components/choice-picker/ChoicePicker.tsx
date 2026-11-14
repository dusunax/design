import * as RadioGroup from "@radix-ui/react-radio-group";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { clsx } from "clsx";
import { type JSX, useId, useState } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { CheckBox } from "../check-box";
import { controlHeightClass, fieldInputClass, fieldLabelClass } from "../field";

// Icon 전체(59개 path)를 끌어오지 않도록 검색 path만 둔다. 출처: Material Symbols search, Apache-2.0
const SEARCH_PATH =
  "M796-121 533-384q-30 26-70 40.5T378-329q-108 0-183-75t-75-181q0-106 75-181t182-75q106 0 180.5 75T632-585q0 43-14 83t-42 75l264 262-44 44ZM377-389q81 0 138-57.5T572-585q0-81-57-138.5T377-781q-82 0-139.5 57.5T180-585q0 81 57.5 138.5T377-389Z";

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
  /** 검색 결과가 없을 때 목록 자리에 보이는 문구 */
  emptyText?: string;
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
  emptyText = "No results",
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
      <div className="moa:flex moa:flex-col moa:gap-1">
        <span id={labelId} className={fieldLabelClass}>
          {label}
        </span>
        {filterable && (
          <div className="moa:relative">
            <svg
              viewBox="0 -960 960 960"
              width={16}
              height={16}
              fill="currentColor"
              aria-hidden
              className="moa:pointer-events-none moa:absolute moa:top-1/2 moa:left-3 moa:-translate-y-1/2 moa:text-fg-muted"
            >
              <path d={SEARCH_PATH} />
            </svg>
            <input
              type="search"
              aria-labelledby={labelId}
              placeholder={filterPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={clsx(fieldInputClass, controlHeightClass, "moa:pl-9")}
            />
          </div>
        )}
      </div>
      {filterable ? (
        // 선택지가 많을 때 쓰므로 목록만 스크롤한다. 여백은 포커스 외곽선이 잘리지 않게 둔다.
        <div className="moa:-m-0.5 moa:max-h-60 moa:overflow-y-auto moa:p-0.5">
          {shown.length > 0 ? list : <p className="moa:m-0 moa:text-body moa:text-fg-muted">{emptyText}</p>}
        </div>
      ) : (
        list
      )}
    </div>
  );
}
