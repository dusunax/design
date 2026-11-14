import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckBox } from "./CheckBox";

test("CheckBox toggles and reports boolean", async () => {
  const onChange = vi.fn();
  render(<CheckBox label="Agree" onChange={onChange} />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onChange).toHaveBeenLastCalledWith(true);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onChange).toHaveBeenLastCalledWith(false);
});
test("CheckBox is reachable by label", async () => {
  render(<CheckBox label="Agree" />);
  await userEvent.click(screen.getByText("Agree"));
  expect(screen.getByLabelText("Agree")).toBeChecked();
});
test("CheckBox uses strong border for 3:1 contrast", () => {
  render(<CheckBox label="Agree" />);
  expect(screen.getByRole("checkbox")).toHaveClass("moa:border-border-strong");
});
