import { render, screen } from "@testing-library/react";
import { Image } from "./Image";

test("scaleDown fit maps to object-scale-down", () => {
  render(<Image url="https://x.dev/a.png" description="a" fit="scaleDown" />);
  expect(screen.getByRole("img")).toHaveClass("moa:object-scale-down");
});
test("avatar is round 40px", () => {
  render(<Image url="https://x.dev/a.png" description="a" variant="avatar" />);
  expect(screen.getByRole("img")).toHaveClass("moa:size-10", "moa:rounded-full");
});
test("defaults to cover so images keep their ratio", () => {
  render(<Image url="https://x.dev/a.png" description="a" />);
  expect(screen.getByRole("img")).toHaveClass("moa:object-cover");
});
test("alt falls back to empty string", () => {
  const { container } = render(<Image url="https://x.dev/a.png" />);
  expect(container.querySelector("img")).toHaveAttribute("alt", "");
});
