import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoaSurfaces } from "./MoaSurfaces";
import type { MoaRenderError } from "./types";

const surface = (components: unknown[], dataModel?: unknown, surfaceId = "s1") => [
  { version: "1.0", createSurface: { surfaceId, components, ...(dataModel === undefined ? {} : { dataModel }) } },
];
const codes = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.map(([e]) => (e as MoaRenderError).code);

test("renders root tree with moa components", () => {
  render(<MoaSurfaces messages={surface([
    { id: "root", component: "Card", child: "col" },
    { id: "col", component: "Column", children: ["hello", "go"] },
    { id: "hello", component: "Text", text: "Hello" },
    { id: "go", component: "Button", child: "goLabel" },
    { id: "goLabel", component: "Text", text: "Go" },
  ])} />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
});

test("puts a Text child of Button as plain label", () => {
  const { container } = render(<MoaSurfaces messages={surface([
    { id: "root", component: "Button", variant: "primary", child: "label" },
    { id: "label", component: "Text", text: "Sign up" },
  ])} />);
  const button = screen.getByRole("button", { name: "Sign up" });
  expect(button.querySelector("p")).toBeNull();
  expect(container.querySelectorAll("p")).toHaveLength(0);
});

test("maps child, children, trigger and content", async () => {
  render(<MoaSurfaces allowSensitive messages={surface([
    { id: "root", component: "Row", children: ["modal", "tabs"] },
    { id: "modal", component: "Modal", trigger: "open", content: "inside" },
    { id: "open", component: "Button", child: "openLabel" },
    { id: "openLabel", component: "Text", text: "Open" },
    { id: "inside", component: "Text", text: "Inside" },
    { id: "tabs", component: "Tabs", tabs: [{ title: "First", child: "one" }, { title: "Second", child: "two" }] },
    { id: "one", component: "Text", text: "Tab one" },
    { id: "two", component: "Text", text: "Tab two" },
  ])} />);
  expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
  expect(screen.getByText("Tab one")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(await screen.findByText("Inside")).toBeInTheDocument();
});

test("passes catalog defaults", () => {
  const { container } = render(<MoaSurfaces isAllowedUrl={() => true} messages={surface([
    { id: "root", component: "Image", url: "https://img.example/a.png", description: "A" },
  ])} />);
  expect(container.querySelector("img")?.className).toContain("moa:object-fill");
});

const form = (extra: unknown[] = []) => surface([
  { id: "root", component: "Column", children: ["name", "send"] },
  { id: "name", component: "TextField", label: "Name", value: { path: "/name" } },
  { id: "send", component: "Button", child: "sendLabel", action: { event: { name: "send", context: { name: { path: "/name" }, fixed: "x" } } } },
  { id: "sendLabel", component: "Text", text: "Send" },
  ...extra,
], { name: "Ada" });

test("binds values and writes input back to path", async () => {
  const onAction = vi.fn();
  render(<MoaSurfaces messages={form()} onAction={onAction} />);
  const input = screen.getByLabelText("Name");
  expect(input).toHaveValue("Ada");
  await userEvent.clear(input);
  await userEvent.type(input, "Grace");
  expect(input).toHaveValue("Grace");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(onAction.mock.calls[0]?.[0].context).toEqual({ name: "Grace", fixed: "x" });
});

test("user input wins over server values", async () => {
  const messages = form();
  const { rerender } = render(<MoaSurfaces messages={messages} />);
  await userEvent.type(screen.getByLabelText("Name"), "!");
  rerender(<MoaSurfaces messages={[...messages, { version: "1.0", updateDataModel: { surfaceId: "s1", path: "/name", value: "Server" } }]} />);
  expect(screen.getByLabelText("Name")).toHaveValue("Ada!");
});

test("resolves action context and calls onAction", async () => {
  const onAction = vi.fn();
  render(<MoaSurfaces messages={form()} onAction={onAction} />);
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  const action = onAction.mock.calls[0]?.[0];
  expect(action).toMatchObject({ name: "send", surfaceId: "s1", sourceComponentId: "send", context: { name: "Ada", fixed: "x" } });
  expect(new Date(action.timestamp).toISOString()).toBe(action.timestamp);
});

test("leaves unknown components and missing ids empty", () => {
  const onError = vi.fn();
  render(<MoaSurfaces onError={onError} messages={surface([
    { id: "root", component: "Column", children: ["ok", "video", "mystery", "ghost"] },
    { id: "ok", component: "Text", text: "Still here" },
    { id: "video", component: "Video", url: "https://v.example" },
    { id: "mystery", component: "Marquee" },
  ])} />);
  expect(screen.getByText("Still here")).toBeInTheDocument();
  expect(codes(onError).sort()).toEqual(["MISSING_COMPONENT", "UNSUPPORTED_COMPONENT", "UNSUPPORTED_COMPONENT"]);
});

test("stops cyclic references at depth limit", () => {
  const onError = vi.fn();
  render(<MoaSurfaces onError={onError} messages={surface([
    { id: "root", component: "Card", child: "b" },
    { id: "b", component: "Card", child: "root" },
  ])} />);
  expect(codes(onError)).toContain("DEPTH_LIMIT");
});

test("stops rendering at the component limit when children are shared", () => {
  const onError = vi.fn();
  const fan = Array.from({ length: 30 }, (_, i) => [0, 1].map((j) => ({
    id: i === 0 && j === 0 ? "root" : `n${i}_${j}`,
    component: i < 29 ? "Row" : "Divider",
    ...(i < 29 ? { children: [`n${i + 1}_0`, `n${i + 1}_1`] } : {}),
  }))).flat();
  const started = performance.now();
  const { container } = render(<MoaSurfaces onError={onError} messages={surface(fan)} />);
  expect(performance.now() - started).toBeLessThan(2000);
  expect(container.querySelectorAll("*").length).toBeLessThanOrEqual(600);
  expect(codes(onError)).toContain("COMPONENT_LIMIT");
});

test("does not render images by default", () => {
  const { container } = render(<MoaSurfaces messages={surface([{ id: "root", component: "Image", url: "https://tracker.example/p.png" }])} />);
  expect(container.querySelector("img")).toBeNull();
});

test("renders images allowed by isAllowedUrl", () => {
  const isAllowedUrl = (url: string, kind: string) => kind === "image" && url.startsWith("https://img.example/");
  const { container } = render(<MoaSurfaces isAllowedUrl={isAllowedUrl} messages={surface([
    { id: "root", component: "Row", children: ["ok", "other", "plain"] },
    { id: "ok", component: "Image", url: "https://img.example/a.png" },
    { id: "other", component: "Image", url: "https://tracker.example/p.png" },
    { id: "plain", component: "Image", url: "http://img.example/a.png" },
  ])} />);
  expect([...container.querySelectorAll("img")].map((i) => i.getAttribute("src"))).toEqual(["https://img.example/a.png"]);
});

test("appends link domain", () => {
  render(<MoaSurfaces messages={surface([{ id: "root", component: "Text", text: "See [https://bank.example](https://evil.example/x)" }])} />);
  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("https://bank.example (evil.example)");
  expect(link).toHaveAttribute("href", "https://evil.example/x");
});

test("turns disallowed links into plain text", () => {
  render(<MoaSurfaces isAllowedUrl={() => false} messages={surface([{ id: "root", component: "Text", text: "See [docs](https://evil.example/x)" }])} />);
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("See docs (evil.example)")).toBeInTheDocument();
});

const sensitive = surface([
  { id: "root", component: "Column", children: ["pw", "modal"] },
  { id: "pw", component: "TextField", label: "Password", variant: "obscured" },
  { id: "modal", component: "Modal", trigger: "open", content: "inside" },
  { id: "open", component: "Button", child: "openLabel" },
  { id: "openLabel", component: "Text", text: "Open" },
  { id: "inside", component: "Text", text: "Inside" },
]);

test("blocks sensitive components by default", () => {
  const onError = vi.fn();
  const { container } = render(<MoaSurfaces onError={onError} messages={sensitive} />);
  expect(container.querySelector('input[type="password"]')).toBeNull();
  expect(screen.queryByRole("button", { name: "Open" })).toBeNull();
  expect(codes(onError)).toEqual(["SENSITIVE_COMPONENT", "SENSITIVE_COMPONENT"]);
});

test("renders sensitive components when allowed", () => {
  const { container } = render(<MoaSurfaces allowSensitive messages={sensitive} />);
  expect(container.querySelector('input[type="password"]')).not.toBeNull();
  expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
});

test("passes only catalog props", () => {
  const { container } = render(<MoaSurfaces messages={surface([
    { id: "root", component: "Text", text: "Hi", props: { style: { position: "fixed" } }, className: "evil", style: { position: "fixed" }, id2: "x" },
  ])} />);
  const p = container.querySelector("p");
  expect(p?.className).not.toContain("evil");
  expect(p?.getAttribute("style") ?? "").not.toContain("fixed");
});

test("drops dangerouslySetInnerHTML, style, className and event props", () => {
  const { container } = render(<MoaSurfaces messages={surface([
    {
      id: "root", component: "Button", child: "label",
      dangerouslySetInnerHTML: { __html: "<img src=x onerror=alert(1)>" },
      className: "evil", style: { position: "fixed" }, onClick: "alert(1)", formAction: "javascript:alert(1)",
    },
    { id: "label", component: "Text", text: "Go" },
  ])} />);
  const button = container.querySelector("button");
  expect(container.querySelector("img")).toBeNull();
  expect(button?.className).not.toContain("evil");
  expect(button?.getAttribute("style") ?? "").not.toContain("fixed");
  expect(button?.hasAttribute("formaction")).toBe(false);
  expect(button?.hasAttribute("onclick")).toBe(false);
});

test("renders strings as text, not HTML", () => {
  const evil = "<img src=x onerror=alert(1)>";
  const { container } = render(<MoaSurfaces messages={surface([
    { id: "root", component: "Column", children: ["t", "f", "c"] },
    { id: "t", component: "Text", text: evil },
    { id: "f", component: "TextField", label: evil, placeholder: evil },
    { id: "c", component: "ChoicePicker", label: evil, options: [{ label: evil, value: "a" }], value: [] },
  ])} />);
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getAllByText(evil, { exact: false }).length).toBeGreaterThan(0);
});

test("reports errors once per messages change", () => {
  const onError = vi.fn();
  const messages = "nope" as unknown as never;
  const { rerender } = render(<MoaSurfaces onError={onError} messages={messages} />);
  rerender(<MoaSurfaces onError={onError} messages={messages} />);
  expect(codes(onError)).toEqual(["NOT_ARRAY"]);
});
