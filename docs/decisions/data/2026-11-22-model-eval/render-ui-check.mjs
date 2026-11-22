// 모델이 render_ui 도구를 부르고 A2UI v1.0 메시지 배열을 주는지 확인한다.
// 모델마다 두 방식으로 한 번씩 부른다: loose(느슨한 스키마 + 규칙 설명), strict(A2UI 부분집합 엄격 스키마).
// 키는 OPENROUTER_API_KEY 환경 변수에서만 읽고, 출력에는 절대 넣지 않는다.
// 사용: node render-ui-check.mjs [--paid] [모델...]   --paid가 없으면 :free 모델만 허용
const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) {
  console.error("OPENROUTER_API_KEY가 없다.");
  process.exit(1);
}
const redact = (s) => String(s).split(KEY).join("[KEY]");

const args = process.argv.slice(2);
const PAID = args.includes("--paid");
const named = args.filter((a) => !a.startsWith("--"));
const MODELS = named.length
  ? named
  : PAID
    ? ["nvidia/nemotron-3.5-super-vl:free", "openai/gpt-5-nano", "deepseek/deepseek-v4-flash", "google/gemini-2.5-flash-lite"]
    : ["nvidia/nemotron-3.5-super-vl:free", "google/gemma-4-31b-it:free"];
for (const m of MODELS) if (!PAID && !m.endsWith(":free")) throw new Error(`유료 모델은 --paid가 있어야 한다: ${m}`);

const SUPPORTED = new Set(["Text", "Image", "Icon", "Row", "Column", "List", "Card", "Divider", "Button", "TextField", "CheckBox", "ChoicePicker", "Slider", "DateTimeInput", "Modal", "Tabs"]);

const SYSTEM = `You can show UI with the render_ui tool. Its "messages" argument is an array of A2UI v1.0 messages.
Each message is {"version":"1.0", ...} with exactly one of: createSurface, updateComponents, updateDataModel, deleteSurface.
createSurface: {"surfaceId": string, "components": Component[], "dataModel"?: object}
Component: {"id": string, "component": one of ${[...SUPPORTED].join(", ")}, ...props}. The root component has id "root".
Containers: Row/Column/List use "children": [ids]; Card/Button use "child": id.
Text: {"text"}. TextField: {"label","value"}. Button: {"child", "action": {"event": {"name", "context"?}}}.
Values can be literals or {"path": "/json/pointer"} into dataModel.`;

const LOOSE_PARAMS = {
  type: "object",
  properties: { messages: { type: "array", items: { type: "object" } } },
  required: ["messages"],
};

// strict 모드 규칙: 모든 키가 required, 선택 값은 null 허용, additionalProperties: false
const nullable = (s) => ({ anyOf: [s, { type: "null" }] });
const VALUE = { anyOf: [{ type: "string" }, { type: "object", properties: { path: { type: "string" } }, required: ["path"], additionalProperties: false }] };
const comp = (name, props) => ({
  type: "object",
  properties: { id: { type: "string" }, component: { type: "string", enum: [name] }, ...props },
  required: ["id", "component", ...Object.keys(props)],
  additionalProperties: false,
});
const COMPONENT = {
  anyOf: [
    comp("Text", { text: VALUE, variant: nullable({ type: "string", enum: ["body", "caption"] }) }),
    comp("Column", { children: { type: "array", items: { type: "string" } } }),
    comp("Row", { children: { type: "array", items: { type: "string" } } }),
    comp("Card", { child: { type: "string" } }),
    comp("Divider", {}),
    comp("TextField", { label: { type: "string" }, value: nullable(VALUE), variant: nullable({ type: "string", enum: ["shortText", "longText", "number", "obscured"] }) }),
    comp("CheckBox", { label: { type: "string" }, value: { anyOf: [{ type: "boolean" }, VALUE.anyOf[1]] } }),
    comp("Button", {
      child: { type: "string" },
      variant: nullable({ type: "string", enum: ["default", "primary", "borderless"] }),
      action: {
        type: "object",
        properties: { event: { type: "object", properties: { name: { type: "string" } }, required: ["name"], additionalProperties: false } },
        required: ["event"],
        additionalProperties: false,
      },
    }),
  ],
};
const STRICT_PARAMS = {
  type: "object",
  properties: {
    messages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          version: { type: "string", enum: ["1.0"] },
          createSurface: {
            type: "object",
            properties: { surfaceId: { type: "string" }, components: { type: "array", items: COMPONENT } },
            required: ["surfaceId", "components"],
            additionalProperties: false,
          },
        },
        required: ["version", "createSurface"],
        additionalProperties: false,
      },
    },
  },
  required: ["messages"],
  additionalProperties: false,
};

const tool = (strict) => ({
  type: "function",
  function: {
    name: "render_ui",
    description: "Show a UI card to the user. Use this whenever a form or structured view helps.",
    parameters: strict ? STRICT_PARAMS : LOOSE_PARAMS,
    ...(strict ? { strict: true } : {}),
  },
});

// strict 모드가 채운 null은 "값 없음"이라 지운다.
const dropNulls = (v) =>
  Array.isArray(v) ? v.map(dropNulls) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null).map(([k, x]) => [k, dropNulls(x)])) : v;

function check(messages) {
  const problems = [];
  if (!Array.isArray(messages)) return ["messages가 배열이 아님"];
  const ids = new Set();
  const refs = [];
  for (const [i, msg] of messages.entries()) {
    if (msg?.version !== "1.0") problems.push(`#${i} version이 "1.0"이 아님`);
    const kinds = ["createSurface", "updateComponents", "updateDataModel", "deleteSurface"].filter((k) => k in (msg ?? {}));
    if (kinds.length !== 1) problems.push(`#${i} 메시지 종류가 ${kinds.length}개`);
    const comps = msg?.createSurface?.components ?? msg?.updateComponents?.components ?? [];
    for (const c of comps) {
      if (typeof c?.id !== "string") problems.push(`#${i} id 없는 부품`);
      else ids.add(c.id);
      if (!SUPPORTED.has(c?.component)) problems.push(`#${i} 지원하지 않는 component: ${JSON.stringify(c?.component)}`);
      if ("props" in (c ?? {})) problems.push(`#${i} ${c.id}: A2UI에 없는 props 객체`);
      if (typeof c?.child === "string") refs.push(c.child);
      if (Array.isArray(c?.children)) {
        for (const r of c.children) typeof r === "string" ? refs.push(r) : problems.push(`#${i} ${c.id}: children에 문자열이 아닌 값`);
      }
    }
  }
  if (ids.size && !ids.has("root")) problems.push('"root" 부품 없음');
  for (const r of refs) if (!ids.has(r)) problems.push(`없는 id 참조: ${r}`);
  return problems;
}

let totalCost = 0;
const summary = [];
for (const model of MODELS) {
  for (const strict of [false, true]) {
    const mode = strict ? "strict" : "loose";
    console.log(`\n=== ${model} [${mode}]`);
    const started = Date.now();
    let result = "";
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: "회원가입 카드를 보여 줘. 이름과 이메일 입력란, 가입 버튼이 있으면 돼." },
          ],
          tools: [tool(strict)],
          tool_choice: "auto",
          usage: { include: true },
        }),
      });
      const ms = Date.now() - started;
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        result = `HTTP ${res.status}`;
        console.log(`HTTP ${res.status} (${ms}ms): ${redact(body?.error?.message ?? "본문 없음")}`);
        if (body?.error?.metadata) console.log(`metadata: ${redact(JSON.stringify(body.error.metadata))}`);
        continue;
      }
      const cost = body.usage?.cost ?? 0;
      totalCost += cost;
      const choice = body.choices?.[0];
      const call = choice?.message?.tool_calls?.find((t) => t.function?.name === "render_ui");
      console.log(`HTTP 200 (${ms}ms), finish_reason=${choice?.finish_reason}, tokens ${body.usage?.prompt_tokens}/${body.usage?.completion_tokens}, $${cost.toFixed(6)}`);
      if (!call) {
        result = "호출 없음";
        console.log(`render_ui 호출 없음. 텍스트: ${redact((choice?.message?.content ?? "").slice(0, 200))}`);
        continue;
      }
      let parsed;
      try {
        parsed = dropNulls(JSON.parse(call.function.arguments));
      } catch {
        result = "JSON 실패";
        console.log(`인자 JSON 파싱 실패: ${redact(call.function.arguments.slice(0, 300))}`);
        continue;
      }
      const problems = check(parsed.messages);
      result = problems.length ? `문제 ${problems.length}개` : "통과";
      console.log(problems.length ? `문제 ${problems.length}개:\n  - ${problems.join("\n  - ")}` : "A2UI 모양 검사 통과");
      console.log(`인자 (앞 800자):\n${redact(JSON.stringify(parsed).slice(0, 800))}`);
    } catch (e) {
      result = "요청 실패";
      console.log(`요청 실패: ${redact(e?.message ?? e)}`);
    } finally {
      summary.push(`${model.padEnd(40)} ${mode.padEnd(6)} ${result} (${Date.now() - started}ms)`);
    }
  }
}
console.log(`\n=== 요약\n${summary.join("\n")}\n총비용 $${totalCost.toFixed(6)}`);
