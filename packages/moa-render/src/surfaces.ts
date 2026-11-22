import { setPath } from "./pointer";
import type { A2uiComponent, MoaRenderError, Surface, Surfaces } from "./types";

export const MAX_DEPTH = 32;
export const MAX_COMPONENTS = 500;

const KINDS = ["createSurface", "updateComponents", "updateDataModel", "deleteSurface"] as const;
type Fields = Record<string, unknown>;
const isRecord = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);

function readComponents(list: unknown, surfaceId: string, errors: MoaRenderError[]): A2uiComponent[] {
  if (list === undefined) return [];
  if (!Array.isArray(list)) {
    errors.push({ code: "INVALID_MESSAGE", message: "components is not an array", surfaceId });
    return [];
  }
  return list.filter((c): c is A2uiComponent => {
    const ok = isRecord(c) && typeof c.id === "string" && typeof c.component === "string";
    if (!ok) errors.push({ code: "INVALID_COMPONENT", message: "component needs string id and component", surfaceId });
    return ok;
  });
}

/** A2UI v1.0 메시지를 순서대로 적용해 surface 목록을 만든다. 오류는 던지지 않고 모은다. */
export function toSurfaces(messages: unknown): { surfaces: Surfaces; errors: MoaRenderError[] } {
  const errors: MoaRenderError[] = [];
  if (!Array.isArray(messages)) return { surfaces: [], errors: [{ code: "NOT_ARRAY", message: "messages is not an array" }] };
  const surfaces = new Map<string, Surface>();

  for (const msg of messages) {
    if (!isRecord(msg)) {
      errors.push({ code: "INVALID_MESSAGE", message: "message is not an object" });
      continue;
    }
    if (msg.version !== "1.0") {
      errors.push({ code: "UNSUPPORTED_VERSION", message: `unsupported version: ${String(msg.version)}` });
      continue;
    }
    const kinds = KINDS.filter((k) => k in msg);
    if (kinds.length !== 1) {
      const other = Object.keys(msg).some((k) => k !== "version");
      errors.push(
        kinds.length === 0 && other
          ? { code: "UNSUPPORTED_MESSAGE", message: `unsupported message: ${Object.keys(msg).filter((k) => k !== "version").join(", ")}` }
          : { code: "INVALID_MESSAGE", message: "a message needs exactly one kind" },
      );
      continue;
    }
    const kind = kinds[0] as (typeof KINDS)[number];
    const body = msg[kind];
    const surfaceId = isRecord(body) && typeof body.surfaceId === "string" ? body.surfaceId : undefined;
    if (!isRecord(body) || surfaceId === undefined) {
      errors.push({ code: "INVALID_MESSAGE", message: `${kind} needs a surfaceId` });
      continue;
    }
    const surface = surfaces.get(surfaceId);

    if (kind === "createSurface") {
      const components = new Map(readComponents(body.components, surfaceId, errors).map((c) => [c.id, c]));
      surfaces.set(surfaceId, { id: surfaceId, components, dataModel: isRecord(body.dataModel) ? structuredClone(body.dataModel) : {} });
      continue;
    }
    if (!surface) {
      errors.push({ code: "UNKNOWN_SURFACE", message: `unknown surface: ${surfaceId}`, surfaceId });
      continue;
    }
    if (kind === "updateComponents") {
      const components = new Map(surface.components);
      for (const c of readComponents(body.components, surfaceId, errors)) components.set(c.id, c);
      surfaces.set(surfaceId, { ...surface, components });
    } else if (kind === "updateDataModel") {
      const r = setPath(surface.dataModel, typeof body.path === "string" ? body.path : "", body.value);
      if (r.ok) surfaces.set(surfaceId, { ...surface, dataModel: r.value });
      else errors.push({ code: r.code, message: `cannot write ${String(body.path)}`, surfaceId });
    } else {
      surfaces.delete(surfaceId);
    }
  }
  return { surfaces: [...surfaces.values()], errors };
}

/** 부품이 가리키는 id 목록. child, children, trigger, content, tabs[].child */
export function childIds(c: A2uiComponent): string[] {
  const ids: string[] = [];
  for (const key of ["child", "trigger", "content"] as const) if (typeof c[key] === "string") ids.push(c[key] as string);
  if (Array.isArray(c.children)) for (const id of c.children) if (typeof id === "string") ids.push(id);
  if (Array.isArray(c.tabs)) for (const tab of c.tabs) if (isRecord(tab) && typeof tab.child === "string") ids.push(tab.child);
  return ids;
}

/** root, 없는 id 참조, 트리 깊이, 부품 수를 검사한다. 서버와 렌더러가 같이 쓴다. */
export function checkSurfaces(surfaces: Surfaces): MoaRenderError[] {
  const errors: MoaRenderError[] = [];
  for (const s of surfaces) {
    if (!s.components.has("root")) errors.push({ code: "MISSING_ROOT", message: 'no component with id "root"', surfaceId: s.id });
    for (const c of s.components.values()) {
      for (const id of childIds(c)) {
        if (!s.components.has(id)) errors.push({ code: "MISSING_COMPONENT", message: `missing component: ${id}`, surfaceId: s.id, componentId: c.id });
      }
    }
    if (exceedsDepth(s, "root")) errors.push({ code: "DEPTH_LIMIT", message: `tree is deeper than ${MAX_DEPTH}`, surfaceId: s.id });
    if (s.components.size > MAX_COMPONENTS) errors.push({ code: "COMPONENT_LIMIT", message: `more than ${MAX_COMPONENTS} components`, surfaceId: s.id });
  }
  return errors;
}

// 단계마다 id 집합을 넓힌다. 여러 부모가 같은 부품을 가리켜도 단계당 부품 수만큼만 보고, 순환도 상한에서 멈춘다.
function exceedsDepth(s: Surface, rootId: string): boolean {
  let level = new Set(s.components.has(rootId) ? [rootId] : []);
  for (let depth = 1; level.size > 0; depth++) {
    if (depth > MAX_DEPTH) return true;
    const next = new Set<string>();
    for (const id of level) {
      const c = s.components.get(id);
      if (c) for (const child of childIds(c)) if (s.components.has(child)) next.add(child);
    }
    level = next;
  }
  return false;
}
