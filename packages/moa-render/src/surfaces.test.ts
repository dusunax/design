import { checkSurfaces, toSurfaces } from "./surfaces";

const create = (components: unknown[], dataModel?: unknown, surfaceId = "s1") => ({
  version: "1.0",
  createSurface: { surfaceId, components, ...(dataModel === undefined ? {} : { dataModel }) },
});
const codes = (errors: { code: string }[]) => errors.map((e) => e.code);

test("creates surface with inline components and data", () => {
  const { surfaces, errors } = toSurfaces([
    create([{ id: "root", component: "Text", text: "hi" }], { name: "Ada" }),
    create([{ id: "root", component: "Divider" }], undefined, "s2"),
  ]);
  expect(errors).toEqual([]);
  expect(surfaces.map((s) => s.id)).toEqual(["s1", "s2"]);
  expect(surfaces[0]?.components.get("root")).toEqual({ id: "root", component: "Text", text: "hi" });
  expect(surfaces[0]?.dataModel).toEqual({ name: "Ada" });
  expect(surfaces[1]?.dataModel).toEqual({});
});

test("updates components by id", () => {
  const { surfaces, errors } = toSurfaces([
    create([{ id: "root", component: "Text", text: "a" }]),
    { version: "1.0", updateComponents: { surfaceId: "s1", components: [{ id: "root", component: "Text", text: "b" }, { id: "x", component: "Divider" }] } },
  ]);
  expect(errors).toEqual([]);
  expect(surfaces[0]?.components.get("root")).toMatchObject({ text: "b" });
  expect([...(surfaces[0]?.components.keys() ?? [])]).toEqual(["root", "x"]);
});

test("updates data model at path and at root", () => {
  const { surfaces } = toSurfaces([
    create([], { user: { name: "" }, list: [1] }),
    { version: "1.0", updateDataModel: { surfaceId: "s1", path: "/user/name", value: "Ada" } },
    { version: "1.0", updateDataModel: { surfaceId: "s1", path: "/list/-", value: 2 } },
  ]);
  expect(surfaces[0]?.dataModel).toEqual({ user: { name: "Ada" }, list: [1, 2] });
  const replaced = toSurfaces([create([], { a: 1 }), { version: "1.0", updateDataModel: { surfaceId: "s1", value: { b: 2 } } }]);
  expect(replaced.surfaces[0]?.dataModel).toEqual({ b: 2 });
});

test("deletes surface", () => {
  const { surfaces } = toSurfaces([create([]), create([], undefined, "s2"), { version: "1.0", deleteSurface: { surfaceId: "s1" } }]);
  expect(surfaces.map((s) => s.id)).toEqual(["s2"]);
});

test("reports unsupported messages and versions", () => {
  const { surfaces, errors } = toSurfaces([
    { version: "0.9", createSurface: { surfaceId: "old", components: [] } },
    { version: "1.0", callRendererFunction: { functionCallId: "f1", callFunction: { call: "x" } } },
    { version: "1.0", updateComponents: { surfaceId: "missing", components: [] } },
    { version: "1.0", createSurface: { surfaceId: "s1", components: [{ component: "Text" }, "nope"] } },
    "not an object",
  ]);
  expect(codes(errors)).toEqual(["UNSUPPORTED_VERSION", "UNSUPPORTED_MESSAGE", "UNKNOWN_SURFACE", "INVALID_COMPONENT", "INVALID_COMPONENT", "INVALID_MESSAGE"]);
  expect(surfaces.map((s) => s.id)).toEqual(["s1"]);
  expect(surfaces[0]?.components.size).toBe(0);
});

test("blocks prototype paths in data model", () => {
  const { surfaces, errors } = toSurfaces([
    create([], { a: 1 }),
    { version: "1.0", updateDataModel: { surfaceId: "s1", path: "/__proto__/polluted", value: true } },
    { version: "1.0", updateDataModel: { surfaceId: "s1", path: "/constructor/prototype/polluted", value: true } },
  ]);
  expect(codes(errors)).toEqual(["BLOCKED_PATH", "BLOCKED_PATH"]);
  expect(surfaces[0]?.dataModel).toEqual({ a: 1 });
  expect(({} as Record<string, unknown>).polluted).toBeUndefined();
});

test("reports non-array input", () => {
  for (const input of [undefined, null, { messages: [] }, "x"]) {
    const { surfaces, errors } = toSurfaces(input);
    expect(surfaces).toEqual([]);
    expect(codes(errors)).toEqual(["NOT_ARRAY"]);
  }
});

test("checkSurfaces reports missing root and missing id references", () => {
  const { surfaces } = toSurfaces([
    create([{ id: "card", component: "Card", child: "nope" }]),
    create([
      { id: "root", component: "Column", children: ["a", "ghost"] },
      { id: "a", component: "Button", child: "가입" },
      { id: "m", component: "Modal", trigger: "a", content: "missing" },
      { id: "t", component: "Tabs", tabs: [{ title: "x", child: "lost" }] },
    ], undefined, "s2"),
  ]);
  const errors = checkSurfaces(surfaces);
  expect(errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ code: "MISSING_ROOT", surfaceId: "s1" }),
    expect.objectContaining({ code: "MISSING_COMPONENT", componentId: "card", surfaceId: "s1" }),
    expect.objectContaining({ code: "MISSING_COMPONENT", componentId: "root" }),
    expect.objectContaining({ code: "MISSING_COMPONENT", componentId: "a" }),
    expect.objectContaining({ code: "MISSING_COMPONENT", componentId: "m" }),
    expect.objectContaining({ code: "MISSING_COMPONENT", componentId: "t" }),
  ]));
  expect(errors).toHaveLength(6);
});

test("checkSurfaces reports depth and component limits", () => {
  const chain = Array.from({ length: 40 }, (_, i) => ({ id: i === 0 ? "root" : `c${i}`, component: "Card", child: `c${i + 1}` }));
  chain.push({ id: "c40", component: "Divider" } as never);
  const cyclic = [{ id: "root", component: "Card", child: "b" }, { id: "b", component: "Card", child: "root" }];
  const many = [{ id: "root", component: "Divider" }, ...Array.from({ length: 500 }, (_, i) => ({ id: `d${i}`, component: "Divider" }))];
  const { surfaces } = toSurfaces([create(chain, undefined, "deep"), create(cyclic, undefined, "loop"), create(many, undefined, "big")]);
  const started = performance.now();
  const errors = checkSurfaces(surfaces);
  expect(errors).toEqual([
    expect.objectContaining({ code: "DEPTH_LIMIT", surfaceId: "deep" }),
    expect.objectContaining({ code: "DEPTH_LIMIT", surfaceId: "loop" }),
    expect.objectContaining({ code: "COMPONENT_LIMIT", surfaceId: "big" }),
  ]);
  expect(performance.now() - started).toBeLessThan(1000);
});

test("checkSurfaces stays fast when many parents share children", () => {
  // 30단계 각 단계의 두 부품이 다음 단계의 두 부품을 모두 가리킴: 경로는 2^30개, 부품은 60개
  const fan = Array.from({ length: 30 }, (_, i) => [0, 1].map((j) => ({
    id: i === 0 && j === 0 ? "root" : `n${i}_${j}`,
    component: "Row",
    children: i < 29 ? [`n${i + 1}_0`, `n${i + 1}_1`] : [],
  }))).flat();
  const { surfaces } = toSurfaces([create(fan, undefined, "fan")]);
  const started = performance.now();
  expect(checkSurfaces(surfaces)).toEqual([]);
  expect(performance.now() - started).toBeLessThan(1000);
});
