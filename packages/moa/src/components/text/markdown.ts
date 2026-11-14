export type InlineNode =
  | { type: "text" | "strong" | "em" | "code"; value: string }
  | { type: "link"; value: string; href: string }
  | { type: "br" };

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

// 본문은 부정 문자 클래스로 잡고 수량자를 중첩하지 않는다(SEC-1.2).
const TOKEN = /\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`|\[([^\]\n]+)\]\((\S*)\)|\n/g;

function safeHref(href: string): string | undefined {
  try {
    return ALLOWED_PROTOCOLS.has(new URL(href).protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}

/** 굵게, 기울임, 인라인 코드, 링크, 줄바꿈만 읽는다. HTML은 해석하지 않는다. */
export function parseInline(src: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const pushText = (value: string) => {
    if (!value) return;
    const last = nodes[nodes.length - 1];
    if (last?.type === "text") last.value += value;
    else nodes.push({ type: "text", value });
  };

  let cursor = 0;
  for (const m of src.matchAll(TOKEN)) {
    pushText(src.slice(cursor, m.index));
    cursor = m.index + m[0].length;
    if (m[1] !== undefined) nodes.push({ type: "strong", value: m[1] });
    else if (m[2] !== undefined) nodes.push({ type: "em", value: m[2] });
    else if (m[3] !== undefined) nodes.push({ type: "code", value: m[3] });
    else if (m[4] !== undefined) {
      const href = safeHref(m[5] ?? "");
      if (href) nodes.push({ type: "link", value: m[4], href });
      else pushText(m[0]);
    } else nodes.push({ type: "br" });
  }
  pushText(src.slice(cursor));
  return nodes;
}
