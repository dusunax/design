import { weightStyle } from "./base";

test("weightStyle maps weight to flexGrow", () => {
  expect(weightStyle(2)).toEqual({ flexGrow: 2 });
  expect(weightStyle(0)).toEqual({ flexGrow: 0 });
  expect(weightStyle(undefined)).toBeUndefined();
});
