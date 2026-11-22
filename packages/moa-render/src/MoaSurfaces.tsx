import {
  Button,
  Card,
  CheckBox,
  ChoicePicker,
  Column,
  DateTimeInput,
  Divider,
  Icon,
  Image,
  List,
  Modal,
  Row,
  Slider,
  Tabs,
  Text,
  TextField,
} from "@dusunax/moa";
import { Fragment, isValidElement, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyEdits, bindingPath, resolve, resolveContext, resolveString } from "./bind";
import { CATALOG_DEFAULTS, isSensitive, oneOf, pickProps } from "./catalog";
import { labelLinks } from "./links";
import { checkSurfaces, MAX_COMPONENTS, MAX_DEPTH, toSurfaces } from "./surfaces";
import type { MoaAction, MoaRenderError, Surface } from "./types";

export type MoaSurfacesProps = {
  /** A2UI v1.0 메시지 배열. 배열이 아니면 아무것도 그리지 않고 onError로 알린다. */
  messages: unknown;
  onAction?: (action: MoaAction) => void;
  /** 같은 오류는 messages가 바뀔 때 한 번만 알린다. */
  onError?: (error: MoaRenderError) => void;
  /** 기본값: 이미지는 모두 막고 링크는 모두 허용한다. 이미지는 https:만 이 함수까지 온다. */
  isAllowedUrl?: (url: string, kind: "image" | "link") => boolean;
  /** obscured TextField와 Modal을 그릴지. 기본 false */
  allowSensitive?: boolean;
};

const JUSTIFY = ["start", "center", "end", "spaceBetween", "spaceAround", "spaceEvenly", "stretch"] as const;
const ALIGN = ["start", "center", "end", "stretch"] as const;
const FITS = ["contain", "cover", "fill", "none", "scaleDown"] as const;
const IMAGE_VARIANTS = ["icon", "avatar", "smallFeature", "mediumFeature", "largeFeature", "header"] as const;

type Fields = Record<string, unknown>;
const isRecord = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const ids = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const defaultAllow = (_url: string, kind: "image" | "link"): boolean => kind === "link";

export function MoaSurfaces({ messages, onAction, onError, isAllowedUrl = defaultAllow, allowSensitive = false }: MoaSurfacesProps): ReactNode {
  const { surfaces, errors } = useMemo(() => toSurfaces(messages), [messages]);
  const checkErrors = useMemo(() => checkSurfaces(surfaces), [surfaces]);
  // 사용자가 입력한 값. surface별 path → 값이고, 서버가 보낸 값보다 우선한다.
  const [edits, setEdits] = useState<ReadonlyMap<string, ReadonlyMap<string, unknown>>>(new Map());
  const write = useCallback((surfaceId: string, path: string, value: unknown) => {
    setEdits((prev) => new Map(prev).set(surfaceId, new Map(prev.get(surfaceId)).set(path, value)));
  }, []);

  const renderErrors: MoaRenderError[] = [];

  function renderSurface(s: Surface): ReactNode {
    const model = applyEdits(s.dataModel, edits.get(s.id) ?? new Map());
    let count = 0;

    const node = (id: unknown, depth: number, key?: string): ReactNode => {
      const c = typeof id === "string" ? s.components.get(id) : undefined;
      // 없는 id와 깊이 초과는 checkSurfaces가 알린다.
      if (!c || depth > MAX_DEPTH) return null;
      // 여러 부모가 같은 부품을 가리키면 같은 부품을 여러 번 그리게 되므로 그리는 수에도 상한을 둔다.
      if (++count > MAX_COMPONENTS) {
        if (count === MAX_COMPONENTS + 1) renderErrors.push({ code: "COMPONENT_LIMIT", message: `stopped after ${MAX_COMPONENTS} components`, surfaceId: s.id });
        return null;
      }
      const p = pickProps(c);
      if (!p) {
        renderErrors.push({ code: "UNSUPPORTED_COMPONENT", message: `unsupported component: ${c.component}`, surfaceId: s.id, componentId: c.id });
        return null;
      }
      if (isSensitive(c) && !allowSensitive) {
        renderErrors.push({ code: "SENSITIVE_COMPONENT", message: `blocked sensitive component: ${c.component}`, surfaceId: s.id, componentId: c.id });
        return null;
      }
      const base = { key, weight: num(p.weight) };
      const children = (list: unknown) => ids(list).map((cid, i) => node(cid, depth + 1, `${cid}:${i}`));
      const str = (v: unknown) => resolveString(v, model);
      const path = bindingPath(p.value);
      const onChange = path === undefined ? undefined : (v: unknown) => write(s.id, path, v);

      switch (c.component) {
        case "Text":
          return <Text {...base} text={labelLinks(str(p.text), (url) => isAllowedUrl(url, "link"))} variant={oneOf(p.variant, ["body", "caption"] as const)} />;
        case "Image": {
          const url = str(p.url);
          if (!url.startsWith("https:") || !isAllowedUrl(url, "image")) return null;
          return <Image {...base} url={url} description={str(p.description)} fit={oneOf(p.fit, FITS) ?? CATALOG_DEFAULTS.imageFit} variant={oneOf(p.variant, IMAGE_VARIANTS)} />;
        }
        case "Icon": {
          const name = resolve(p.name, model);
          if (typeof name === "string") return <Icon {...base} name={name as never} />;
          if (isRecord(name) && typeof name.svgPath === "string") return <Icon {...base} name={{ svgPath: name.svgPath }} />;
          return null;
        }
        case "Row":
          return <Row {...base} justify={oneOf(p.justify, JUSTIFY)} align={oneOf(p.align, ALIGN)}>{children(p.children)}</Row>;
        case "Column":
          return <Column {...base} justify={oneOf(p.justify, JUSTIFY)} align={oneOf(p.align, ALIGN)}>{children(p.children)}</Column>;
        case "List":
          return <List {...base} direction={oneOf(p.direction, ["vertical", "horizontal"] as const)} align={oneOf(p.align, ALIGN)}>{children(p.children)}</List>;
        case "Card":
          return <Card {...base}>{node(p.child, depth + 1)}</Card>;
        case "Divider":
          return <Divider {...base} axis={oneOf(p.axis, ["horizontal", "vertical"] as const)} />;
        case "Button": {
          const event = isRecord(p.action) && isRecord(p.action.event) ? p.action.event : undefined;
          const click =
            event && typeof event.name === "string" && onAction
              ? () =>
                  onAction({
                    name: event.name as string,
                    surfaceId: s.id,
                    sourceComponentId: c.id,
                    timestamp: new Date().toISOString(),
                    context: resolveContext(event.context, model),
                    ...(event.userMessage === undefined ? {} : { userMessage: str(event.userMessage) }),
                  })
              : undefined;
          return (
            <Button {...base} variant={oneOf(p.variant, ["default", "primary", "borderless"] as const)} onClick={click}>
              {node(p.child, depth + 1)}
            </Button>
          );
        }
        case "TextField":
          return (
            <TextField
              {...base}
              label={str(p.label)}
              placeholder={str(p.placeholder) || undefined}
              variant={oneOf(p.variant, ["shortText", "longText", "number", "obscured"] as const)}
              {...(path === undefined ? { defaultValue: str(p.value) } : { value: str(p.value), onChange })}
            />
          );
        case "CheckBox":
          return (
            <CheckBox
              {...base}
              label={str(p.label)}
              {...(path === undefined ? { defaultValue: p.value === true } : { value: resolve(p.value, model) === true, onChange })}
            />
          );
        case "ChoicePicker": {
          const options = (Array.isArray(p.options) ? p.options : [])
            .filter(isRecord)
            .map((o) => ({ label: str(o.label), value: typeof o.value === "string" ? o.value : String(o.value) }));
          const selected = ids(resolve(p.value, model));
          return (
            <ChoicePicker
              {...base}
              label={str(p.label)}
              options={options}
              variant={oneOf(p.variant, ["multipleSelection", "mutuallyExclusive"] as const)}
              displayStyle={oneOf(p.displayStyle, ["checkbox", "chips"] as const)}
              filterable={p.filterable === true}
              {...(path === undefined ? { defaultValue: selected } : { value: selected, onChange })}
            />
          );
        }
        case "Slider": {
          const value = num(resolve(p.value, model));
          return (
            <Slider
              {...base}
              label={str(p.label)}
              min={num(p.min)}
              max={num(p.max) ?? 100}
              steps={num(p.steps)}
              {...(path === undefined ? { defaultValue: value } : { value, onChange })}
            />
          );
        }
        case "DateTimeInput":
          return (
            <DateTimeInput
              {...base}
              label={str(p.label)}
              enableDate={typeof p.enableDate === "boolean" ? p.enableDate : undefined}
              enableTime={typeof p.enableTime === "boolean" ? p.enableTime : undefined}
              min={str(p.min) || undefined}
              max={str(p.max) || undefined}
              {...(path === undefined ? { defaultValue: str(p.value) } : { value: str(p.value), onChange })}
            />
          );
        case "Modal": {
          const trigger = node(p.trigger, depth + 1);
          if (!isValidElement(trigger)) return null;
          // A2UI Modal에는 제목이 없다. moa Modal은 title이 필수라 빈 문자열을 넘긴다.
          return <Modal {...base} trigger={trigger} title="">{node(p.content, depth + 1)}</Modal>;
        }
        case "Tabs": {
          const tabs = (Array.isArray(p.tabs) ? p.tabs : [])
            .filter(isRecord)
            .map((t, i) => ({ title: str(t.title), child: node(t.child, depth + 1, `${String(t.child)}:${i}`) }));
          return tabs.length ? <Tabs {...base} tabs={tabs} /> : null;
        }
        default:
          return null;
      }
    };

    return node("root", 1);
  }

  const rendered = surfaces.map((s) => <Fragment key={s.id}>{renderSurface(s)}</Fragment>);

  const all = [...new Map([...errors, ...checkErrors, ...renderErrors].map((e) => [JSON.stringify(e), e])).values()];
  const key = JSON.stringify(all);
  const reported = useRef("");
  useEffect(() => {
    if (!onError || key === reported.current) return;
    reported.current = key;
    for (const e of JSON.parse(key) as MoaRenderError[]) onError(e);
  }, [key, onError]);

  return <>{rendered}</>;
}
