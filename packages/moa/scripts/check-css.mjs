// 배포 CSS가 쓰는 쪽 페이지의 전역 스타일을 바꾸지 않는지 검사한다.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../dist/styles.css", import.meta.url), "utf8");
const errors = [];

if (!css.includes("--moa-color-primary")) errors.push("--moa-color-primary 토큰이 없다");
if (/(^|[;{\s])--color-[\w-]+\s*:/.test(css)) errors.push("접두사 없는 --color-* 정의가 있다");

const globalSelector = /(?:^|})\s*((?:\*|html|body|:root|[a-z][a-z0-9]*)(?=[\s,{:.[>+~])[^{]*)\{([^}]*)\}/g;
for (const [, selector, body] of css.matchAll(globalSelector)) {
  const s = selector.trim();
  if (s.startsWith("@")) continue;
  // :root, :host의 테마 변수 정의만 허용한다
  if (/^(:root|:host)/.test(s) && /^\s*(--moa-[\w-]+\s*:[^;]*;?\s*)*$/.test(body)) continue;
  errors.push(`전역 셀렉터: ${s}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
