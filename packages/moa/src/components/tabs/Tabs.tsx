import * as RadixTabs from "@radix-ui/react-tabs";
import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

export type TabsProps = BaseProps & {
  /** catalog와 같이 탭 내용 필드 이름은 `child`다. */
  tabs: { title: string; child: ReactNode }[];
  defaultIndex?: number;
  /** 선택된 탭의 index를 넘긴다. */
  onChange?: (index: number) => void;
};

export function Tabs({ tabs, defaultIndex = 0, onChange, weight, className }: TabsProps): JSX.Element {
  return (
    <RadixTabs.Root
      defaultValue={String(defaultIndex)}
      onValueChange={(v) => onChange?.(Number(v))}
      className={clsx("moa:flex moa:flex-col moa:gap-3 moa:text-fg", className)}
      style={weightStyle(weight)}
    >
      <RadixTabs.List className="moa:flex moa:gap-1 moa:border-b moa:border-border">
        {tabs.map((tab, i) => (
          <RadixTabs.Trigger
            key={tab.title}
            value={String(i)}
            className="moa:-mb-px moa:cursor-pointer moa:border-0 moa:border-b-2 moa:border-transparent moa:bg-transparent moa:px-3 moa:py-2 moa:[font-family:inherit] moa:text-body moa:font-medium moa:text-fg-muted moa:hover:text-fg moa:focus-visible:outline-2 moa:focus-visible:outline-primary moa:data-[state=active]:border-primary moa:data-[state=active]:text-fg"
          >
            {tab.title}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((tab, i) => (
        <RadixTabs.Content key={tab.title} value={String(i)} className="moa:text-body moa:focus-visible:outline-2 moa:focus-visible:outline-primary">
          {tab.child}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
