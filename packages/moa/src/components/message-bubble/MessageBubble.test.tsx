import { render, screen } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";

test("MessageBubble marks role", () => {
  render(<MessageBubble role="assistant">Hi</MessageBubble>);
  expect(screen.getByText("Hi").closest("[data-role]")).toHaveAttribute("data-role", "assistant");
});
test("MessageBubble names the speaker for screen readers", () => {
  const { rerender } = render(<MessageBubble role="user">Hi</MessageBubble>);
  expect(screen.getByText("Hi")).toHaveTextContent("You: Hi");
  rerender(<MessageBubble role="assistant" labels={{ assistant: "모아" }}>Hi</MessageBubble>);
  expect(screen.getByText("모아:")).toHaveClass("moa:sr-only");
  rerender(<MessageBubble role="system">Hi</MessageBubble>);
  expect(screen.getByText("Hi")).toHaveTextContent(/^Hi$/);
});
