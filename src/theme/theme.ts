//@ts-ignore
import themeBaseCss from "./theme-base.css";

export let lightTheme = "";
export let darkTheme = "";

// -1 auto 0 light 1 dark
export let currentTheme = -1;

export let themeElement: HTMLStyleElement;

export const setLightTheme = (theme: string) => {
  lightTheme = theme;

  applyTheme();
};

export const setDarkTheme = (theme: string) => {
  darkTheme = theme;

  applyTheme();
};

export const applyTheme = () => {
  const viewThemeId =
    currentTheme == -1
      ? +matchMedia("(prefers-color-scheme: dark)").matches
      : currentTheme;

  if (viewThemeId == 0) {
    themeElement.innerHTML = lightTheme;
  } else {
    themeElement.innerHTML = darkTheme;
  }

  GM_setValue("theme_id", currentTheme);
};

export const installThemeBase = () => {
  const style = document.createElement("style");
  style.innerHTML = themeBaseCss;

  document.head.append(style);

  themeElement = document.createElement("style");
  document.head.append(themeElement);

  console.log(GM_getValue("theme_id"));
  currentTheme = GM_getValue("theme_id") ?? -1;

  console.log(currentTheme);

  const themeList = document.createElement("select");
  const listContent = [
    ["自動", -1],
    ["ライト", 0],
    ["ダーク", 1],
  ] as const;

  themeList.id = "taittsuu-plus-theme-list";

  for (const [name, value] of listContent) {
    const item = document.createElement("option");

    item.innerText = name;
    item.value = "" + value;
    if (value == currentTheme) {
      item.setAttribute("selected", "true");
    }

    themeList.append(item);
  }

  themeList.addEventListener("change", async () => {
    currentTheme = +themeList.selectedOptions[0].value;

    applyTheme();

    console.log(currentTheme, GM_getValue("theme_id"));
  });

  console.log(themeList);

  $(".post-header-menu").append(themeList);
};
