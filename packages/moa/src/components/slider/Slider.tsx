import * as RadixSlider from "@radix-ui/react-slider";
import { clsx } from "clsx";
import { type JSX, useState } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";
import { fieldLabelClass } from "../field";

export type SliderProps = BaseProps & {
  label: string;
  min?: number;
  max: number;
  /** 구간 수. 없으면 100구간으로 나눈다. */
  steps?: number;
  value?: number;
  defaultValue?: number;
  /** 이벤트가 아니라 값을 넘긴다. */
  onChange?: (value: number) => void;
};

export function Slider({ label, min = 0, max, steps, value, defaultValue, onChange, weight, className }: SliderProps): JSX.Element {
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  return (
    <div className={clsx("moa:flex moa:flex-col moa:gap-2", className)} style={weightStyle(weight)}>
      <div className="moa:flex moa:items-center moa:justify-between">
        <span className={fieldLabelClass}>
          {label}
        </span>
        <span className="moa:text-body moa:text-fg-muted moa:tabular-nums">{Number(current.toFixed(2))}</span>
      </div>
      <RadixSlider.Root
        min={min}
        max={max}
        step={(max - min) / (steps ?? 100)}
        value={[current]}
        onValueChange={([v]) => {
          setInner(v);
          onChange?.(v);
        }}
        className="moa:relative moa:flex moa:h-4 moa:touch-none moa:items-center moa:select-none"
      >
        <RadixSlider.Track className="moa:relative moa:h-1 moa:grow moa:rounded-full moa:bg-border">
          <RadixSlider.Range className="moa:absolute moa:h-full moa:rounded-full moa:bg-primary" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          aria-label={label}
          className="moa:block moa:size-4 moa:cursor-pointer moa:rounded-full moa:border-2 moa:border-primary moa:bg-bg moa:focus-visible:outline-2 moa:focus-visible:outline-offset-2 moa:focus-visible:outline-primary"
        />
      </RadixSlider.Root>
    </div>
  );
}
