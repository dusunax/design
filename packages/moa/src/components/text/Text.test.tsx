import { render, screen } from "@testing-library/react";
import { parseInline } from "./markdown";
import { Text } from "./Text";

test("parses strong, em, code, link, br", () => {
  expect(parseInline("a **b** *c* `d` [e](https://x.dev)\nf")).toEqual([
    { type: "text", value: "a " }, { type: "strong", value: "b" }, { type: "text", value: " " },
    { type: "em", value: "c" }, { type: "text", value: " " }, { type: "code", value: "d" },
    { type: "text", value: " " }, { type: "link", value: "e", href: "https://x.dev" },
    { type: "br" }, { type: "text", value: "f" },
  ]);
});
test("does not linkify javascript: urls", () => {
  expect(parseInline("[x](javascript:alert(1))")).toEqual([
    { type: "text", value: "[x](javascript:alert(1))" },
  ]);
});
test("blocks scheme bypasses", () => {
  for (const href of ["JaVaScRiPt:alert(1)", " javascript:alert(1)", "java\tscript:alert(1)", "data:text/html,x"]) {
    expect(parseInline(`[x](${href})`).some((n) => n.type === "link")).toBe(false);
  }
});
test("does not linkify overly long links", () => {
  // SEC-2.2: 길이 상한이 없으면 닫히지 않은 [ 반복에 제곱 시간이 걸린다
  expect(parseInline(`[${"a".repeat(501)}](https://x.dev)`).some((n) => n.type === "link")).toBe(false);
  expect(parseInline(`[a](https://x.dev/${"a".repeat(2048)})`).some((n) => n.type === "link")).toBe(false);
  expect(parseInline(`[${"a".repeat(500)}](https://x.dev)`).some((n) => n.type === "link")).toBe(true);
});
test("react blocks javascript: href", () => {
  // SEC-1.1 근거. 실패하면 SEC-1.1을 🟡로 되돌린다
  const { container } = render(<a href="javascript:alert(1)">x</a>);
  expect(container.querySelector("a")?.getAttribute("href") ?? "").not.toContain("alert");
});
test("never renders raw HTML", () => {
  render(<Text text="<img src=x onerror=alert(1)>" />);
  expect(document.querySelector("img")).toBeNull();
});
test("caption variant uses caption size", () => {
  render(<Text text="hi" variant="caption" />);
  expect(screen.getByText("hi")).toHaveClass("moa:text-caption");
});
test("body variant uses prose size for reading", () => {
  render(<Text text="hello" />);
  expect(screen.getByText("hello")).toHaveClass("moa:text-prose");
});
