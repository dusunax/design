import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "./Slider";

test("Slider snaps to steps", async () => {
  const onChange = vi.fn();
  render(<Slider label="Volume" min={0} max={10} steps={5} defaultValue={0} onChange={onChange} />);
  screen.getByRole("slider").focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenLastCalledWith(2);
});
test("Slider exposes label", () => {
  render(<Slider label="Volume" max={10} />);
  expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
});
