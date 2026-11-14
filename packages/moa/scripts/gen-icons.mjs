// catalog 아이콘 이름에 맞는 Material Symbols(Apache-2.0) path를 paths.ts로 생성한다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = join(dirname(require.resolve("@material-symbols/svg-400/package.json")), "outlined");
const namesSrc = readFileSync(new URL("../src/components/icon/names.ts", import.meta.url), "utf8");
const names = [...namesSrc.matchAll(/^\s+"(\w+)",$/gm)].map((m) => m[1]);

// catalog 이름과 Material Symbols 파일 이름이 다른 경우. on/off 쌍은 채움과 외곽선으로 구분한다.
const OVERRIDES = {
  favorite: "favorite-fill",
  favoriteOff: "favorite",
  star: "star-fill",
  starHalf: "star_half-fill",
  starOff: "star",
  payment: "credit_card",
  phone: "mobile",
  play: "play_arrow",
  rewind: "fast_rewind",
};

const snake = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const paths = {};
const missing = [];
for (const name of names) {
  const file = join(root, `${OVERRIDES[name] ?? snake(name)}.svg`);
  if (!existsSync(file)) {
    missing.push(`${name} (${OVERRIDES[name] ?? snake(name)})`);
    continue;
  }
  const d = readFileSync(file, "utf8").match(/ d="([^"]+)"/)?.[1];
  if (!d) missing.push(`${name}: d 속성 없음`);
  else paths[name] = d;
}
if (missing.length) {
  console.error(`대체 이름이 필요한 아이콘:\n${missing.join("\n")}`);
  process.exit(1);
}

const out = `// 생성 파일이다. 직접 고치지 말고 \`pnpm gen:icons\`를 실행한다.
// Icons: Material Symbols (https://github.com/google/material-design-icons), Apache-2.0
import type { IconName } from "./names";

export const ICON_PATHS: Record<IconName, string> = {
${names.map((n) => `  ${n}: ${JSON.stringify(paths[n])},`).join("\n")}
};
`;
writeFileSync(new URL("../src/components/icon/paths.ts", import.meta.url), out);
console.log(`${names.length}개 생성`);
