import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { type JSX, type ReactElement, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { type BaseProps, weightStyle } from "../../utils/base";

// Icon 전체(59개 path)를 끌어오지 않도록 닫기 path만 둔다. 출처: Material Symbols close, Apache-2.0
const CLOSE_PATH = "m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z";

export type ModalProps = BaseProps & {
  /** 누르면 열리는 요소. ref를 받을 수 있어야 한다. */
  trigger: ReactElement;
  /** 화면에 보이는 제목이자 dialog의 접근성 이름 */
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Modal({ trigger, title, children, open, onOpenChange, weight, className }: ModalProps): JSX.Element {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<string>();
  // 포털은 body 아래에 그려지므로 트리거 근처의 테마를 복사해 둔다.
  useLayoutEffect(() => {
    const next = triggerRef.current?.closest("[data-moa-theme]")?.getAttribute("data-moa-theme") ?? undefined;
    setTheme((prev) => (prev === next ? prev : next));
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger ref={triggerRef} asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <div data-moa-theme={theme}>
          <Dialog.Overlay className="moa:fixed moa:inset-0 moa:z-50 moa:bg-black/40" />
          <Dialog.Content
            aria-describedby={undefined}
            className={clsx(
              "moa:fixed moa:top-1/2 moa:left-1/2 moa:z-50 moa:box-border moa:flex moa:max-h-[85vh] moa:w-[min(90vw,480px)] moa:-translate-x-1/2 moa:-translate-y-1/2 moa:flex-col moa:overflow-hidden moa:rounded-lg moa:border moa:border-border moa:bg-bg moa:text-fg moa:shadow-lg moa:focus:outline-none",
              className,
            )}
            style={weightStyle(weight)}
          >
            <div className="moa:flex moa:items-center moa:justify-between moa:gap-2 moa:py-3 moa:pr-2 moa:pl-4">
              <Dialog.Title className="moa:m-0 moa:text-prose moa:font-semibold">{title}</Dialog.Title>
              <Dialog.Close
                aria-label="Close"
                className="moa:inline-flex moa:size-8 moa:cursor-pointer moa:items-center moa:justify-center moa:rounded-md moa:border-0 moa:bg-transparent moa:text-fg-muted moa:hover:bg-surface moa:hover:text-fg moa:focus-visible:outline-2 moa:focus-visible:outline-primary"
              >
                <svg viewBox="0 -960 960 960" width={20} height={20} fill="currentColor" aria-hidden>
                  <path d={CLOSE_PATH} />
                </svg>
              </Dialog.Close>
            </div>
            <div className="moa:overflow-y-auto moa:px-4 moa:pb-4 moa:text-body">{children}</div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
