// moa Text의 링크 문법과 같은 패턴. 길이 상한도 같다.
const LINK = /\[([^\]\n]{1,500})\]\((\S{0,2048})\)/g;

function hostOf(url: string): string | undefined {
  try {
    const u = new URL(url);
    return (u.protocol === "mailto:" ? u.pathname : u.hostname) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * 링크 글자 뒤에 실제 도메인을 붙인다(SEC-2.3). `[문서](https://evil.example/x)` → `[문서 (evil.example)](…)`
 * allow가 false면 링크 대신 같은 글자를 평문으로 둔다.
 */
export function labelLinks(text: string, allow: (url: string) => boolean): string {
  return text.replace(LINK, (match, label: string, url: string) => {
    const host = hostOf(url);
    if (!host) return match;
    const labeled = `${label} (${host})`;
    return allow(url) ? `[${labeled}](${url})` : labeled;
  });
}
