type Op = { op: string; path: string; value?: unknown };
export type PatchResult = { ok: true; value: unknown } | { ok: false; reason: string };

const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);

function parse(path: string): string[] | undefined {
  if (path === "") return [];
  if (!path.startsWith("/")) return undefined;
  return path.slice(1).split("/").map((t) => t.replaceAll("~1", "/").replaceAll("~0", "~"));
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function index(arr: unknown[], token: string, allowEnd: boolean): number | undefined {
  if (token === "-") return allowEnd ? arr.length : undefined;
  if (!/^(0|[1-9]\d*)$/.test(token)) return undefined;
  const i = Number(token);
  return i < arr.length || (allowEnd && i === arr.length) ? i : undefined;
}

/** RFC 6902 중 add·replace만 적용한다. 하나라도 안 되면 원본을 그대로 두고 실패를 돌려준다. */
export function applyPatch(doc: unknown, ops: readonly Op[]): PatchResult {
  let root = structuredClone(doc);
  for (const { op, path, value } of ops) {
    if (op !== "add" && op !== "replace") return { ok: false, reason: `unsupported op: ${op}` };
    const tokens = parse(path);
    if (!tokens) return { ok: false, reason: `invalid path: ${path}` };
    if (tokens.some((t) => BLOCKED.has(t))) return { ok: false, reason: `blocked path: ${path}` };
    if (tokens.length === 0) {
      root = structuredClone(value);
      continue;
    }
    let parent: unknown = root;
    for (const t of tokens.slice(0, -1)) {
      // 자기 속성만 따라간다. 상속된 속성으로 내려가지 않는다.
      if (Array.isArray(parent)) {
        const i = index(parent, t, false);
        if (i === undefined) return { ok: false, reason: `missing path: ${path}` };
        parent = parent[i];
      } else if (isRecord(parent) && Object.hasOwn(parent, t)) {
        parent = parent[t];
      } else {
        return { ok: false, reason: `missing path: ${path}` };
      }
    }
    const last = tokens[tokens.length - 1] as string;
    const v = structuredClone(value);
    if (Array.isArray(parent)) {
      const i = index(parent, last, op === "add");
      if (i === undefined) return { ok: false, reason: `missing path: ${path}` };
      if (op === "add") parent.splice(i, 0, v);
      else parent[i] = v;
    } else if (isRecord(parent)) {
      if (op === "replace" && !Object.hasOwn(parent, last)) return { ok: false, reason: `missing path: ${path}` };
      Object.defineProperty(parent, last, { value: v, writable: true, enumerable: true, configurable: true });
    } else {
      return { ok: false, reason: `missing path: ${path}` };
    }
  }
  return { ok: true, value: root };
}
