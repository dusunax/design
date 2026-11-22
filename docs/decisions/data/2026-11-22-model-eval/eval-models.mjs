// render_ui 통과율 평가. 프롬프트 5개 × 반복 N회 × 모델.
// 키는 OPENROUTER_API_KEY 환경 변수에서만 읽고, 출력과 결과 파일에 넣지 않는다.
// 사용: node eval-models.mjs [--repeats 6] [--paid] [모델...]
import { appendFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
const fi = argv.indexOf("--format");
const FORMAT = fi >= 0 ? argv[fi + 1] : "flat"; // flat: 모델은 surface만 쓰고 서버가 A2UI 메시지로 감쌈, nested: A2UI 메시지 배열을 통째로
if (!["flat", "nested"].includes(FORMAT)) throw new Error(`--format은 flat 또는 nested: ${FORMAT}`);
const named = argv.filter((a, i) => !a.startsWith("--") && !["--repeats", "--format"].includes(argv[i - 1]));
const MODELS = named.length ? named : ["deepseek/deepseek-v4-flash", "openai/gpt-5-nano"];
for (const m of MODELS) if (!PAID && !m.endsWith(":free")) throw new Error(`유료 모델은 --paid가 있어야 한다: ${m}`);

const OUT = fileURLToPath(new URL(`./eval-results-${FORMAT}.jsonl`, import.meta.url));
writeFileSync(OUT, "");

// MOA-10.4a 시스템 프롬프트 초안: 규칙 + 완성된 예시 하나
const EXAMPLE = {
  messages: [
    {
      version: "1.0",
      createSurface: {
        surfaceId: "signup",
        dataModel: { name: "", email: "" },
        components: [
          { id: "root", component: "Card", child: "form" },
          { id: "form", component: "Column", children: ["title", "name", "email", "submit"] },
          { id: "title", component: "Text", text: "Sign up" },
          { id: "name", component: "TextField", label: "Name", value: { path: "/name" } },
          { id: "email", component: "TextField", label: "Email", value: { path: "/email" } },
          { id: "submit", component: "Button", child: "submitLabel", variant: "primary", action: { event: { name: "signup", context: { name: { path: "/name" }, email: { path: "/email" } } } } },
          { id: "submitLabel", component: "Text", text: "Sign up" },
        ],
      },
    },
  ],
};
const FLAT_EXAMPLE = EXAMPLE.messages[0].createSurface;
const FLAT_SYSTEM = `You can show UI with the render_ui tool. Call it whenever a form, list or choice helps.
The arguments describe one surface: {"surfaceId": string, "components": Component[], "dataModel"?: object}. Rules:
1. "components" is a flat array. A component is a flat object: {"id", "component", ...props}. Put props directly on the component. Never use a "props" or "style" object.
2. The root component has id "root". Every id you reference must exist.
3. Row, Column and List take "children": an array of id strings. Card and Button take "child": one id string. A Button's child is the id of a Text component, never the label itself.
4. Bind values to the data model with {"path": "/pointer"}; put initial values in "dataModel". A plain string is shown as-is.
5. Button actions are {"event": {"name": string, "context"?: {key: value or {"path"}}}}.
6. Components: Text{text,variant?: body|caption}, TextField{label,value,variant?: shortText|longText|number}, CheckBox{label,value}, ChoicePicker{label,options:[{label,value}],value:[...],variant?: mutuallyExclusive|multipleSelection}, Slider{label,min,max,value}, DateTimeInput{label,value,enableDate?,enableTime?}, Button{child,variant?: default|primary|borderless,action}, Row/Column/List{children}, Card{child}, Divider{}, Image{url,description}, Icon{name}, Tabs{tabs:[{title,child}]}.
Example arguments:
${JSON.stringify(FLAT_EXAMPLE)}`;
const NESTED_SYSTEM = `You can show UI with the render_ui tool. Call it whenever a form, list or choice helps.
The "messages" argument is an array of A2UI v1.0 messages. Rules:
1. Each message is {"version":"1.0","createSurface":{...}}. Put every component inside createSurface.components.
2. A component is a flat object: {"id", "component", ...props}. Put props directly on the component. Never use a "props" or "style" object.
3. The root component has id "root". Every id you reference must exist.
4. Row, Column and List take "children": an array of id strings. Card and Button take "child": one id string. A Button's child is the id of a Text component, never the label itself.
5. Bind values to the data model with {"path": "/pointer"}; put initial values in createSurface.dataModel. A plain string is shown as-is.
6. Button actions are {"event": {"name": string, "context"?: {key: value or {"path"}}}}.
7. Components: Text{text,variant?: body|caption}, TextField{label,value,variant?: shortText|longText|number}, CheckBox{label,value}, ChoicePicker{label,options:[{label,value}],value:[...],variant?: mutuallyExclusive|multipleSelection}, Slider{label,min,max,value}, DateTimeInput{label,value,enableDate?,enableTime?}, Button{child,variant?: default|primary|borderless,action}, Row/Column/List{children}, Card{child}, Divider{}, Image{url,description}, Icon{name}, Tabs{tabs:[{title,child}]}.
Example:
${JSON.stringify(EXAMPLE)}`;

const SYSTEM = FORMAT === "flat" ? FLAT_SYSTEM : NESTED_SYSTEM;
const TOOL = {
  type: "function",
  function: {
    name: "render_ui",
    description: "Show a UI card to the user.",
    parameters: FORMAT === "flat"
      ? { type: "object", properties: { surfaceId: { type: "string" }, components: { type: "array", items: { type: "object" } }, dataModel: { type: "object" } }, required: ["surfaceId", "components"] }
      : { type: "object", properties: { messages: { type: "array", items: { type: "object" } } }, required: ["messages"] },
  },
};
// 서버가 할 일: flat 인자를 A2UI v1.0 createSurface 메시지로 감싼다.
const toMessages = (args) => (FORMAT === "flat" ? [{ version: "1.0", createSurface: args }] : args.messages);

const PRIOR_SURFACE = { surfaceId: "contact", dataModel: { name: "", email: "" }, components: [
  { id: "root", component: "Card", child: "col" },
  { id: "col", component: "Column", children: ["name", "email", "send"] },
  { id: "name", component: "TextField", label: "이름", value: { path: "/name" } },
  { id: "email", component: "TextField", label: "이메일", value: { path: "/email" } },
  { id: "send", component: "Button", child: "sendLabel", action: { event: { name: "send" } } },
  { id: "sendLabel", component: "Text", text: "보내기" },
] };
const PRIOR = JSON.stringify(FORMAT === "flat" ? PRIOR_SURFACE : { messages: [{ version: "1.0", createSurface: PRIOR_SURFACE }] });

const PROMPTS = [
  { key: "form", messages: [{ role: "user", content: "회원가입 카드를 보여 줘. 이름과 이메일 입력란, 가입 버튼이 있으면 돼." }] },
  { key: "list", messages: [{ role: "user", content: "오늘 할 일 세 개(장보기, 운동, 독서)를 체크박스 목록으로 보여 줘." }] },
  { key: "choice", messages: [{ role: "user", content: "피자 토핑을 여러 개 고를 수 있는 선택지를 보여 줘. 페퍼로니, 버섯, 올리브, 양파." }] },
  { key: "action", messages: [{ role: "user", content: "예약 날짜와 시간을 고르고 확인 버튼을 누르면 고른 값이 전달되는 카드를 보여 줘." }] },
  { key: "edit", messages: [
    { role: "user", content: "연락처 입력 카드를 보여 줘." },
    { role: "assistant", content: `이 화면을 보여 줌: ${PRIOR}` },
    { role: "user", content: "이메일 칸을 빼고 전화번호 칸을 넣은 카드로 다시 보여 줘." },
  ] },
];

const SUPPORTED = new Set(["Text", "Image", "Icon", "Row", "Column", "List", "Card", "Divider", "Button", "TextField", "CheckBox", "ChoicePicker", "Slider", "DateTimeInput", "Modal", "Tabs"]);
const isPath = (v) => v && typeof v === "object" && typeof (v.path ?? v["@path"]) === "string";

function check(messages) {
  const problems = [];
  if (!Array.isArray(messages) || messages.length === 0) return ["messages가 비었거나 배열이 아님"];
  const ids = new Map();
  const refs = [];
  for (const [i, msg] of messages.entries()) {
    if (msg?.version !== "1.0") problems.push(`#${i} version`);
    const kinds = ["createSurface", "updateComponents", "updateDataModel", "deleteSurface"].filter((k) => k in (msg ?? {}));
    if (kinds.length !== 1) problems.push(`#${i} 메시지 종류 ${kinds.length}개`);
    const comps = msg?.createSurface?.components ?? msg?.updateComponents?.components ?? [];
    for (const c of comps) {
      if (typeof c?.id !== "string") { problems.push("id 없는 부품"); continue; }
      ids.set(c.id, c);
      if (!SUPPORTED.has(c.component)) problems.push(`${c.id}: component ${JSON.stringify(c.component)}`);
      if ("props" in c || "style" in c) problems.push(`${c.id}: props/style 객체`);
      if ("child" in c) typeof c.child === "string" ? refs.push([c.id, c.child]) : problems.push(`${c.id}: child가 문자열 아님`);
      if ("children" in c) Array.isArray(c.children) && c.children.every((x) => typeof x === "string") ? c.children.forEach((x) => refs.push([c.id, x])) : problems.push(`${c.id}: children 형식`);
      if (typeof c.value === "string" && c.value.startsWith("/")) problems.push(`${c.id}: value가 path 문자열("${c.value}")`);
      if (c.component === "Button" && c.action !== undefined && typeof c.action?.event?.name !== "string") problems.push(`${c.id}: action 형식`);
    }
  }
  if (!ids.has("root")) problems.push("root 없음");
  for (const [from, to] of refs) if (!ids.has(to)) problems.push(`${from} → 없는 id "${to}"`);
  return problems;
}

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
console.log(`[${FORMAT}] 요청 ${total}회 예정 (모델 ${MODELS.length} × 프롬프트 ${PROMPTS.length} × ${REPEATS}회). 결과 파일: ${OUT}`);
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
          body: JSON.stringify({ model, messages: [{ role: "system", content: SYSTEM }, ...p.messages], tools: [TOOL], tool_choice: "auto", usage: { include: true } }),
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
            let parsed;
            try { parsed = JSON.parse(call.function.arguments); } catch { row.problems = ["JSON 파싱 실패"]; }
            if (parsed) row.problems = typeof parsed.components === "string" || typeof parsed.messages === "string" ? ["배열을 JSON 문자열로 감쌈"] : check(toMessages(parsed));
            row.result = row.problems.length ? "fail" : "pass";
            if (row.result === "pass") s.pass++;
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
