import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const tabs = [
  { title: "One", child: "Panel one" },
  { title: "Two", child: "Panel two" },
];

test("Tabs switches panel with arrow keys", async () => {
  const onChange = vi.fn();
  render(<Tabs tabs={tabs} onChange={onChange} />);
  await userEvent.click(screen.getByRole("tab", { name: "One" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
  expect(onChange).toHaveBeenLastCalledWith(1);
});
test("Tabs defaultIndex selects tab", () => {
  render(<Tabs tabs={tabs} defaultIndex={1} />);
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
});
