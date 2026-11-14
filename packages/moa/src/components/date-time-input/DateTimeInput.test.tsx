import { render, screen } from "@testing-library/react";
import { DateTimeInput } from "./DateTimeInput";

test("DateTimeInput picks input type from flags", () => {
  const cases = [
    [{ enableDate: true, enableTime: true }, "datetime-local"],
    [{ enableDate: true, enableTime: false }, "date"],
    [{ enableDate: false, enableTime: true }, "time"],
    [{ enableDate: false, enableTime: false }, "date"],
  ] as const;
  for (const [flags, type] of cases) {
    const { unmount } = render(<DateTimeInput label="When" {...flags} />);
    expect(screen.getByLabelText("When")).toHaveAttribute("type", type);
    unmount();
  }
});
test("DateTimeInput passes min/max through", () => {
  render(<DateTimeInput label="When" enableDate min="2026-01-01" max="2026-12-31" />);
  const input = screen.getByLabelText("When");
  expect(input).toHaveAttribute("min", "2026-01-01");
  expect(input).toHaveAttribute("max", "2026-12-31");
});
