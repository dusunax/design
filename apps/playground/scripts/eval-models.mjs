// render_ui 통과율 평가. 프롬프트 5개 × 반복 N회 × 모델.
// 프롬프트와 검사는 서버와 같은 server/prompt.ts, server/validate.ts를 쓴다. Vite로 불러와 alias와 확장자 없는 import를 푼다.
// 키는 OPENROUTER_API_KEY 환경 변수에서만 읽고, 출력과 결과 파일에 넣지 않는다.
// 사용: node scripts/eval-models.mjs [--repeats 6] [--paid] [모델...]
import { appendFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) {
  console.error("OPENROUTER_API_KEY가 없다.");
  process.exit(1);
}
const redact = (s) => String(s).split(KEY).join("[KEY]");

const argv = process.argv.slice(2);
const PAID = argv.includes("--paid");
const ri = argv.indexOf("--repeats");
const REPEATS = ri >= 0 ? Number(argv[ri + 1]) : 6;
const named = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--repeats");

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ root, configFile: `${root}vite.config.ts`, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const { SYSTEM_PROMPT, RENDER_UI_TOOL } = await vite.ssrLoadModule("/server/prompt.ts");
const { checkRenderUi } = await vite.ssrLoadModule("/server/validate.ts");
const { RECOMMENDED_MODELS } = await vite.ssrLoadModule("/server/model.ts");
await vite.close();

const MODELS = named.length ? named : RECOMMENDED_MODELS.map((m) => m.id);
for (const m of MODELS) if (!PAID && !m.endsWith(":free")) throw new Error(`유료 모델은 --paid가 있어야 한다: ${m}`);

const OUT = fileURLToPath(new URL("./eval-results.jsonl", import.meta.url));
writeFileSync(OUT, "");

const PRIOR = JSON.stringify({ surfaceId: "contact", dataModel: { name: "", email: "" }, components: [
  { id: "root", component: "Card", child: "col" },
  { id: "col", component: "Column", children: ["name", "email", "send"] },
  { id: "name", component: "TextField", label: "이름", value: { path: "/name" } },
  { id: "email", component: "TextField", label: "이메일", value: { path: "/email" } },
  { id: "send", component: "Button", child: "sendLabel", action: { event: { name: "send" } } },
  { id: "sendLabel", component: "Text", text: "보내기" },
] });

const PROMPTS = [
  { key: "form", messages: [{ role: "user", content: "회원가입 카드를 보여 줘. 이름과 이메일 입력란, 가입 버튼이 있으면 돼." }] },
  { key: "list", messages: [{ role: "user", content: "오늘 할 일 세 개(장보기, 운동, 독서)를 체크박스 목록으로 보여 줘." }] },
  { key: "choice", messages: [{ role: "user", content: "피자 토핑을 여러 개 고를 수 있는 선택지를 보여 줘. 페퍼로니, 버섯, 올리브, 양파." }] },
  { key: "action", messages: [{ role: "user", content: "예약 날짜와 시간을 고르고 확인 버튼을 누르면 고른 값이 전달되는 카드를 보여 줘." }] },
  { key: "edit", messages: [
    { role: "user", content: "연락처 입력 카드를 보여 줘." },
    // 서버가 activity 메시지를 바꾸는 모양과 같다.
    { role: "assistant", content: `이 화면을 보여 줌: ${PRIOR}` },
    { role: "user", content: "이메일 칸을 빼고 전화번호 칸을 넣은 카드로 다시 보여 줘." },
  ] },
];

// 95% Wilson 구간
function wilson(k, n) {
  if (!n) return [0, 0];
  const z = 1.96, p = k / n, d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d, h = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
const pct = (x) => `${Math.round(x * 100)}%`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const total = MODELS.length * PROMPTS.length * REPEATS;
console.log(`요청 ${total}회 예정 (모델 ${MODELS.length} × 프롬프트 ${PROMPTS.length} × ${REPEATS}회). 결과 파일: ${OUT}`);
const stats = {};
let n = 0;
for (const model of MODELS) {
  const s = (stats[model] = { sent: 0, responded: 0, pass: 0, noCall: 0, http: {}, ms: [], cost: 0, byPrompt: {} });
  for (let r = 0; r < REPEATS; r++) {
    for (const p of PROMPTS) {
      n++;
      const started = Date.now();
      const row = { model, prompt: p.key, rep: r };
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...p.messages], tools: [RENDER_UI_TOOL], tool_choice: "auto", usage: { include: true } }),
        });
        const body = await res.json().catch(() => ({}));
        row.ms = Date.now() - started;
        row.status = res.status;
        s.sent++;
        if (!res.ok) {
          s.http[res.status] = (s.http[res.status] ?? 0) + 1;
          row.error = redact(body?.error?.metadata?.limit_source ?? body?.error?.message ?? "");
        } else {
          s.responded++;
          s.ms.push(row.ms);
          s.cost += body.usage?.cost ?? 0;
          row.cost = body.usage?.cost ?? 0;
          const call = body.choices?.[0]?.message?.tool_calls?.find((t) => t.function?.name === "render_ui");
          if (!call) {
            s.noCall++;
            row.result = "noCall";
            row.text = redact((body.choices?.[0]?.message?.content ?? "").slice(0, 300));
          } else {
            const checked = checkRenderUi(call.function.arguments ?? "");
            row.problems = checked.ok ? [] : checked.errors;
            row.result = checked.ok ? "pass" : "fail";
            if (checked.ok) s.pass++;
            row.args = redact(call.function.arguments).slice(0, 12000);
          }
          const bp = (s.byPrompt[p.key] ??= { n: 0, pass: 0 });
          bp.n++;
          if (row.result === "pass") bp.pass++;
        }
      } catch (e) {
        row.error = redact(e?.message ?? e);
      }
      appendFileSync(OUT, JSON.stringify(row) + "\n");
      console.log(`[${n}/${total}] ${model} ${p.key}#${r} ${row.status ?? "ERR"} ${row.result ?? row.error ?? ""} ${row.ms ?? ""}ms${row.problems?.length ? " — " + row.problems.slice(0, 3).join("; ") : ""}`);
      if (model.endsWith(":free")) await sleep(3200); // 분당 20회 한도 아래로
    }
  }
}

console.log("\n=== 요약 (통과율은 응답한 요청 기준, 95% 구간)");
for (const [model, s] of Object.entries(stats)) {
  const [lo, hi] = wilson(s.pass, s.responded);
  const sorted = [...s.ms].sort((a, b) => a - b);
  const med = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const http = Object.entries(s.http).map(([k, v]) => `${k}×${v}`).join(", ") || "없음";
  console.log(`${model}\n  응답 ${s.responded}/${s.sent} (HTTP 오류: ${http}), 통과 ${s.pass}/${s.responded} = ${s.responded ? pct(s.pass / s.responded) : "-"} [${pct(lo)}~${pct(hi)}], 도구 미호출 ${s.noCall}, 중앙값 ${(med / 1000).toFixed(1)}초, 비용 $${s.cost.toFixed(4)}`);
  console.log(`  프롬프트별: ${Object.entries(s.byPrompt).map(([k, v]) => `${k} ${v.pass}/${v.n}`).join(", ")}`);
}
