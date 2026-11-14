import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";

test("label is associated", () => {
  render(<TextField label="Name" />);
  expect(screen.getByLabelText("Name")).toBeInstanceOf(HTMLInputElement);
});
test("longText renders textarea, obscured renders password", () => {
  const { rerender } = render(<TextField label="L" variant="longText" />);
  expect(screen.getByLabelText("L")).toBeInstanceOf(HTMLTextAreaElement);
  rerender(<TextField label="L" variant="obscured" />);
  expect(screen.getByLabelText("L")).toHaveAttribute("type", "password");
});
test("number variant reports empty string when cleared", async () => {
  const onChange = vi.fn();
  render(<TextField label="N" variant="number" defaultValue="3" onChange={onChange} />);
  await userEvent.clear(screen.getByLabelText("N"));
  expect(onChange).toHaveBeenLastCalledWith("");
});
