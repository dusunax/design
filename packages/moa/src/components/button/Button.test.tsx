import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

test("defaults to type=button", () => {
  render(<Button>Go</Button>);
  expect(screen.getByRole("button")).toHaveAttribute("type", "button");
});
test("primary uses primary tokens", () => {
  render(<Button variant="primary">Go</Button>);
  expect(screen.getByRole("button")).toHaveClass("moa:bg-primary", "moa:text-primary-fg");
});
test("calls onClick and respects disabled", async () => {
  const onClick = vi.fn();
  const { rerender } = render(<Button onClick={onClick}>Go</Button>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
  rerender(<Button onClick={onClick} disabled>Go</Button>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
});
test("disabled uses neutral colors instead of fading the variant", () => {
  render(<Button variant="primary" disabled>Go</Button>);
  expect(screen.getByRole("button")).toHaveClass("moa:disabled:bg-surface", "moa:disabled:text-fg-muted");
});
