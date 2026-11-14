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
test("longText only resizes vertically", () => {
  render(<TextField label="L" variant="longText" />);
  expect(screen.getByLabelText("L")).toHaveClass("moa:resize-y");
});
test("invalid input shows danger border via :user-invalid", () => {
  render(<TextField label="N" variant="number" />);
  expect(screen.getByLabelText("N")).toHaveClass("moa:user-invalid:border-danger");
});
test("invalid sets aria-invalid only when true", () => {
  const { rerender } = render(<TextField label="E" invalid />);
  expect(screen.getByLabelText("E")).toHaveAttribute("aria-invalid", "true");
  rerender(<TextField label="E" />);
  expect(screen.getByLabelText("E")).not.toHaveAttribute("aria-invalid");
});
