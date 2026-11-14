import { render, screen } from "@testing-library/react";
import { Card } from "./card";
import { Column } from "./column";
import { Divider } from "./divider";
import { List } from "./list";
import { Row } from "./row";

test("Row maps justify and align to classes", () => {
  render(<Row justify="spaceBetween" align="center">x</Row>);
  const el = screen.getByText("x");
  expect(el).toHaveClass("moa:flex-row", "moa:justify-between", "moa:items-center");
});
test("Column defaults to start/stretch", () => {
  render(<Column>x</Column>);
  expect(screen.getByText("x")).toHaveClass("moa:flex-col", "moa:justify-start", "moa:items-stretch");
});
test("weight becomes flexGrow", () => {
  render(<Card weight={2}>x</Card>);
  expect(screen.getByText("x")).toHaveStyle({ flexGrow: "2" });
});
test("List wraps each child in listitem", () => {
  render(<List><span>a</span><span>b</span></List>);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
test("Divider exposes orientation", () => {
  render(<Divider axis="vertical" />);
  expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
});
