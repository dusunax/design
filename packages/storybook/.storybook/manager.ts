import { createElement } from "react";
import { addons, types } from "storybook/manager-api";
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

// 한국어 빌드는 storybook-static/, 영어 빌드는 storybook-static/en/에 있다. 경로로 지금 언어를 알고 반대쪽으로 잇는다.
const isEn = /\/en\/(index\.html)?$/.test(location.pathname);

addons.register("moa/locale", () => {
  addons.add("moa/locale/link", {
    type: types.TOOL,
    title: "Language",
    render: () =>
      createElement(
        "a",
        {
          href: isEn ? "../" : "./en/",
          // 보고 있던 스토리(?path=…)를 유지한 채 언어만 바꾼다. 주소는 이동하면서 바뀌므로 누르는 순간 읽는다.
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            location.href = (isEn ? "../" : "./en/") + location.search;
          },
          style: { alignSelf: "center", padding: "0 8px", fontSize: 13, color: "inherit" },
        },
        isEn ? "한국어" : "English",
      ),
  });
});
