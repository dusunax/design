import { render, screen } from "@testing-library/react";
import { RunStatus } from "./RunStatus";

test("RunStatus renders default and custom labels", () => {
  const { rerender } = render(<RunStatus status="finished" />);
  expect(screen.getByRole("status")).toHaveTextContent("Done");
  rerender(<RunStatus status="running" labels={{ running: "실행 중" }} />);
  expect(screen.getByRole("status")).toHaveTextContent("실행 중");
});
test("RunStatus error shows message", () => {
  render(<RunStatus status="error" message="Timeout" />);
  expect(screen.getByRole("status")).toHaveTextContent("Error");
  expect(screen.getByRole("status")).toHaveTextContent("Timeout");
});
