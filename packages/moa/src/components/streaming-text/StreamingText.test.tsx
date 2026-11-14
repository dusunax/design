import { render, screen } from "@testing-library/react";
import { StreamingText } from "./StreamingText";

test("StreamingText shows cursor only while streaming", () => {
  const { container, rerender } = render(<StreamingText text="Hello" streaming />);
  expect(container.querySelector("[aria-hidden]")).toHaveTextContent("▍");
  rerender(<StreamingText text="Hello" streaming={false} />);
  expect(container.querySelector("[aria-hidden]")).toBeNull();
});
test("StreamingText is aria-busy while streaming", () => {
  const { container, rerender } = render(<StreamingText text="Hello" streaming />);
  const live = container.querySelector("[aria-live=polite]");
  expect(live).toHaveAttribute("aria-busy", "true");
  rerender(<StreamingText text="Hello" streaming={false} />);
  expect(live).toHaveAttribute("aria-busy", "false");
});
test("StreamingText keeps markdown literal", () => {
  render(<StreamingText text="**a" streaming />);
  expect(screen.getByText("**a")).toBeInTheDocument();
});
