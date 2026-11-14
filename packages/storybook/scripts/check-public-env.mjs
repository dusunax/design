// STORYBOOK_*, VITE_* 변수는 빌드 결과물에 문자열로 들어가 공개된다(SEC-1.6).
const ALLOWED = new Set(["STORYBOOK_LOCALE"]);

const blocked = Object.keys(process.env).filter(
  (name) => /^(STORYBOOK_|VITE_)/.test(name) && !ALLOWED.has(name),
);

if (blocked.length) {
  console.error(`허용 목록에 없는 공개 환경 변수: ${blocked.join(", ")}`);
  process.exit(1);
}
