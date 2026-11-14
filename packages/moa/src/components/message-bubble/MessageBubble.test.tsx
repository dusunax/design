import { render, screen } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";

test("MessageBubble marks role", () => {
  render(<MessageBubble role="assistant">Hi</MessageBubble>);
  expect(screen.getByText("Hi").closest("[data-role]")).toHaveAttribute("data-role", "assistant");
});
