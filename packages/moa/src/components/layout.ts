export type Justify = "start" | "center" | "end" | "spaceBetween" | "spaceAround" | "spaceEvenly" | "stretch";
export type Align = "start" | "center" | "end" | "stretch";

export const justifyClass: Record<Justify, string> = {
  start: "moa:justify-start",
  center: "moa:justify-center",
  end: "moa:justify-end",
  spaceBetween: "moa:justify-between",
  spaceAround: "moa:justify-around",
  spaceEvenly: "moa:justify-evenly",
  stretch: "moa:justify-stretch",
};

export const alignClass: Record<Align, string> = {
  start: "moa:items-start",
  center: "moa:items-center",
  end: "moa:items-end",
  stretch: "moa:items-stretch",
};
