import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";
import { ICON_NAMES } from "./names";
import { ICON_PATHS } from "./paths";

test("every catalog name has a path", () => {
  expect(ICON_NAMES).toHaveLength(59);
  for (const n of ICON_NAMES) expect(ICON_PATHS[n]).toMatch(/^[Mm]/); // path는 moveto로 시작한다
});
test("decorative by default, labelled when label given", () => {
  const { container, rerender } = render(<Icon name="send" />);
  expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  rerender(<Icon name="send" label="Send" />);
  expect(screen.getByRole("img", { name: "Send" })).toBeInTheDocument();
});
test("accepts custom svgPath", () => {
  const { container } = render(<Icon name={{ svgPath: "M0 0h10" }} />);
  expect(container.querySelector("path")).toHaveAttribute("d", "M0 0h10");
});
