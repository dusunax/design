import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Storybook 화면(사이드바, 툴바)은 흰색으로 두어 부품 화면과 섞이지 않게 한다.
addons.setConfig({
  theme: create({
    base: "light",
    appBg: "#ffffff",
    appContentBg: "#ffffff",
    appPreviewBg: "#ffffff",
    barBg: "#ffffff",
  }),
});
