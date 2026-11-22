const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);

export type PointerResult = { ok: true; value: unknown } | { ok: false; code: "BLOCKED_PATH" | "INVALID_PATH" };

export function parsePointer(path: string): string[] | "invalid" | "blocked" {
  if (path === "" || path === "/") return [];
  if (!path.startsWith("/")) return "invalid";
  const tokens = path.slice(1).split("/").map((t) => t.replaceAll("~1", "/").replaceAll("~0", "~"));
  return tokens.some((t) => BLOCKED.has(t)) ? "blocked" : tokens;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** 자기 속성만 따라 읽는다. 없거나 막힌 경로는 undefined */
export function getPath(doc: unknown, path: string): unknown {
  const tokens = parsePointer(path);
  if (!Array.isArray(tokens)) return undefined;
  let cur = doc;
  for (const t of tokens) {
    if (Array.isArray(cur)) cur = /^\d+$/.test(t) ? cur[Number(t)] : undefined;
    else if (isRecord(cur) && Object.hasOwn(cur, t)) cur = cur[t];
    else return undefined;
  }
  return cur;
}

/** 원본을 바꾸지 않고 path에 value를 넣은 복사본을 돌려준다. 중간 객체가 없으면 만든다. */
export function setPath(doc: unknown, path: string, value: unknown): PointerResult {
  const tokens = parsePointer(path);
  if (tokens === "blocked") return { ok: false, code: "BLOCKED_PATH" };
  if (tokens === "invalid") return { ok: false, code: "INVALID_PATH" };
  if (tokens.length === 0) return { ok: true, value: structuredClone(value) };
  const root = isRecord(doc) || Array.isArray(doc) ? structuredClone(doc) : {};
  let cur: unknown = root;
  for (const [i, t] of tokens.entries()) {
    const last = i === tokens.length - 1;
    if (Array.isArray(cur)) {
      const idx = t === "-" ? cur.length : /^\d+$/.test(t) ? Number(t) : -1;
      if (idx < 0 || idx > cur.length) return { ok: false, code: "INVALID_PATH" };
      if (last) cur[idx] = structuredClone(value);
      else cur = cur[idx] ??= {};
    } else if (isRecord(cur)) {
      if (last) Object.defineProperty(cur, t, { value: structuredClone(value), writable: true, enumerable: true, configurable: true });
      else {
        if (!Object.hasOwn(cur, t) || (!isRecord(cur[t]) && !Array.isArray(cur[t]))) cur[t] = {};
        cur = cur[t];
      }
    } else {
      return { ok: false, code: "INVALID_PATH" };
    }
  }
  return { ok: true, value: root };
}
