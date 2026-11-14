import { render, screen } from "@testing-library/react";
import { ToolCallCard } from "./ToolCallCard";

test("pretty-prints valid JSON args", () => {
  const { container } = render(<ToolCallCard name="search" status="finished" args='{"q":"moa","n":2}' defaultOpen />);
  expect(container.querySelector("pre")?.textContent).toBe('{\n  "q": "moa",\n  "n": 2\n}');
});
test("shows raw args when JSON is partial", () => {
  const { container } = render(<ToolCallCard name="weather" status="running" args='{"city":"Seo' defaultOpen />);
  expect(container.querySelector("pre")?.textContent).toBe('{"city":"Seo');
});
test("error status shows result in danger color", () => {
  render(<ToolCallCard name="weather" status="error" result="Timeout" defaultOpen />);
  expect(screen.getByText("Timeout")).toHaveClass("moa:text-danger");
});
test("defaultOpen opens details", () => {
  const { container, rerender } = render(<ToolCallCard name="search" status="pending" />);
  expect(container.querySelector("details")).not.toHaveAttribute("open");
  rerender(<ToolCallCard name="other" status="pending" defaultOpen key="b" />);
  expect(container.querySelector("details")).toHaveAttribute("open");
});
