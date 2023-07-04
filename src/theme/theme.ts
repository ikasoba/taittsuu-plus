//@ts-ignore
import themeBaseCss from "./theme-base.css";

export interface PlusTheme {
  name: string;
  style:
    | {
        type: "inline";
        value: string;
      }
    | {
        type: "url";
        value: string;
      };
}

export const defaultLightTheme: PlusTheme = {
  name: "ノーマル・ライト",
  style: {
    type: "url",
    value: "https://ikasoba.github.io/taittsuu-plus/themes/normal-light.css",
  },
};

export const defaultDarkTheme: PlusTheme = {
  name: "ノーマル・ダーク",
  style: {
    type: "url",
    value: "https://ikasoba.github.io/taittsuu-plus/themes/normal-dark.css",
  },
};

export let lightTheme: PlusTheme = GM_getValue(
  "light_theme",
  defaultLightTheme
);

export let darkTheme: PlusTheme = GM_getValue("dark_theme", defaultDarkTheme);

export let lightThemeCache: string | null = JSON.parse(
  GM_getValue("light_theme_cache", "null")
);
export let darkThemeCache: string | null = JSON.parse(
  GM_getValue("dark_theme_cache", "null")
);

// -1 auto 0 light 1 dark
export let currentThemeMode = GM_getValue("theme_id", -1);

export let themeElement: HTMLStyleElement;

export const setLightTheme = (theme: PlusTheme) => {
  lightTheme = theme;
  lightThemeCache = null;

  GM_setValue("light_theme", lightTheme);
  GM_setValue("light_theme_cache", lightThemeCache);

  applyTheme();
};

export const setDarkTheme = (theme: PlusTheme) => {
  darkTheme = theme;
  darkThemeCache = null;

  GM_setValue("dark_theme", darkTheme);
  GM_setValue("dark_theme_cache", darkThemeCache);

  applyTheme();
};

export const applyTheme = async () => {
  console.log(lightTheme, darkTheme);

  const viewThemeId =
    currentThemeMode == -1
      ? +matchMedia("(prefers-color-scheme: dark)").matches
      : currentThemeMode;

  const theme = viewThemeId == 0 ? lightTheme : darkTheme;
  let cache = viewThemeId == 0 ? lightThemeCache : darkThemeCache;

  if (theme.style.type == "inline") {
    themeElement.innerHTML = theme.style.value;
  } else if (cache) {
    themeElement.innerHTML = cache;
  } else {
    const css = (await GM.xmlHttpRequest<string>({ url: theme.style.value }))
      .context;

    if (viewThemeId) {
      lightThemeCache = cache = css;
    } else {
      darkThemeCache = cache = css;
    }

    themeElement.innerHTML = cache;
  }

  GM_setValue("theme_id", currentThemeMode);
};

export const installThemeBase = () => {
  const style = document.createElement("style");
  style.innerHTML = themeBaseCss;

  document.head.append(style);

  themeElement = document.createElement("style");
  document.head.append(themeElement);

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
    if (value == currentThemeMode) {
      item.setAttribute("selected", "true");
    }

    themeList.append(item);
  }

  applyTheme();

  themeList.addEventListener("change", async () => {
    currentThemeMode = +themeList.selectedOptions[0].value;

    applyTheme();
  });

  $(".post-header-menu").append(themeList);
};
