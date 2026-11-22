import { getPath, setPath } from "./pointer";

type Fields = Record<string, unknown>;
const isRecord = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);

/** `{ path }` 또는 `{ "@path" }`면 그 경로 */
export function bindingPath(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  const path = value.path ?? value["@path"];
  return typeof path === "string" ? path : undefined;
}

const isFunctionCall = (value: unknown): boolean =>
  isRecord(value) && (typeof value.call === "string" || typeof value["@call"] === "string");

/** 바인딩이면 데이터 모델에서 읽고, 함수 호출이면 빈 값, 그 밖에는 리터럴 그대로 */
export function resolve(value: unknown, model: unknown): unknown {
  const path = bindingPath(value);
  if (path !== undefined) return getPath(model, path);
  return isFunctionCall(value) ? undefined : value;
}

export function resolveString(value: unknown, model: unknown): string {
  const v = resolve(value, model);
  return typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : "";
}

export function resolveContext(context: unknown, model: unknown): Record<string, unknown> {
  if (!isRecord(context)) return {};
  return Object.fromEntries(Object.entries(context).map(([k, v]) => [k, resolve(v, model)]));
}

/** 사용자가 입력한 값(path → 값)을 데이터 모델 위에 덮는다. 막힌 경로는 건너뛴다. */
export function applyEdits(model: unknown, edits: ReadonlyMap<string, unknown>): unknown {
  let out = model;
  for (const [path, value] of edits) {
    const r = setPath(out, path, value);
    if (r.ok) out = r.value;
  }
  return out;
}
