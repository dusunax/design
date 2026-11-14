import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

test("opens from trigger and shows title as dialog name", async () => {
  render(
    <Modal trigger={<button type="button">Open</button>} title="Title">
      Body
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog", { name: "Title" })).toHaveTextContent("Body");
});
test("closes on Escape and via close button", async () => {
  render(
    <Modal trigger={<button type="button">Open</button>} title="Title">
      Body
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
test("controlled open calls onOpenChange(false)", async () => {
  const onOpenChange = vi.fn();
  render(
    <Modal trigger={<button type="button">Open</button>} title="Title" open onOpenChange={onOpenChange}>
      Body
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
test("inherits dark theme inside portal", async () => {
  render(
    <div data-moa-theme="dark">
      <Modal trigger={<button type="button">Open</button>} title="Title">
        Body
      </Modal>
    </div>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog").closest('[data-moa-theme="dark"]')).not.toBeNull();
});
