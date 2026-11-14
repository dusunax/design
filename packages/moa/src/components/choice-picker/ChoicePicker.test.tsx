import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChoicePicker } from "./ChoicePicker";

const options = [
  { label: "Apple", value: "a" },
  { label: "Banana", value: "b" },
  { label: "Cherry", value: "c" },
];

test("mutuallyExclusive checkbox is a radiogroup", async () => {
  const onChange = vi.fn();
  render(<ChoicePicker label="Fruit" options={options} onChange={onChange} />);
  expect(screen.getByRole("radiogroup", { name: "Fruit" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: "Banana" }));
  expect(onChange).toHaveBeenLastCalledWith(["b"]);
});
test("multipleSelection chips toggles multiple values", async () => {
  const onChange = vi.fn();
  render(<ChoicePicker label="Fruit" options={options} variant="multipleSelection" displayStyle="chips" onChange={onChange} />);
  expect(screen.getByRole("group", { name: "Fruit" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Apple" }));
  await userEvent.click(screen.getByRole("button", { name: "Banana" }));
  expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
});
test("multipleSelection checkbox toggles values", async () => {
  const onChange = vi.fn();
  render(<ChoicePicker label="Fruit" options={options} variant="multipleSelection" defaultValue={["a"]} onChange={onChange} />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Cherry" }));
  expect(onChange).toHaveBeenLastCalledWith(["a", "c"]);
  await userEvent.click(screen.getByRole("checkbox", { name: "Apple" }));
  expect(onChange).toHaveBeenLastCalledWith(["c"]);
});
test("single chips can deselect to empty array", async () => {
  const onChange = vi.fn();
  render(<ChoicePicker label="Fruit" options={options} displayStyle="chips" defaultValue={["a"]} onChange={onChange} />);
  await userEvent.click(screen.getByRole("radio", { name: "Apple" }));
  expect(onChange).toHaveBeenLastCalledWith([]);
});
test("filter narrows options case-insensitively", async () => {
  render(<ChoicePicker label="Fruit" options={options} filterable />);
  await userEvent.type(screen.getByRole("searchbox", { name: "Fruit" }), "aN");
  expect(screen.getByRole("radio", { name: "Banana" })).toBeInTheDocument();
  expect(screen.queryByRole("radio", { name: "Apple" })).not.toBeInTheDocument();
});
test("keeps selection hidden by filter", async () => {
  const onChange = vi.fn();
  render(<ChoicePicker label="Fruit" options={options} variant="multipleSelection" defaultValue={["b"]} filterable onChange={onChange} />);
  const search = screen.getByRole("searchbox", { name: "Fruit" });
  await userEvent.type(search, "app");
  expect(screen.queryByRole("checkbox", { name: "Banana" })).not.toBeInTheDocument();
  expect(onChange).not.toHaveBeenCalled();
  await userEvent.clear(search);
  expect(screen.getByRole("checkbox", { name: "Banana" })).toBeChecked();
});
