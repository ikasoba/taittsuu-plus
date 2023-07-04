//@ts-ignore
import themeBaseCss from "./theme-base.css";

const style = document.createElement("style");
const primaryColorStyle = document.createElement("style");
const themeElement: HTMLStyleElement = document.createElement("style");
style.innerHTML = themeBaseCss;

document.head.append(style, primaryColorStyle, themeElement);

export interface PlusTheme {
  type: "light" | "dark";
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
  type: "light",
  name: "ノーマル",
  style: {
    type: "url",
    value: "https://ikasoba.github.io/taittsuu-plus/themes/normal-light.css",
  },
};

export const defaultDarkTheme: PlusTheme = {
  type: "dark",
  name: "ノーマル",
  style: {
    type: "url",
    value: "https://ikasoba.github.io/taittsuu-plus/themes/normal-dark.css",
  },
};

//console.time("load theme");

export let lightTheme: PlusTheme = GM_getValue(
  "light_theme",
  defaultLightTheme
);

export let darkTheme: PlusTheme = GM_getValue("dark_theme", defaultDarkTheme);

////console.timeEnd("load theme");

//console.time("load theme cache");

export let lightThemeCache: string | null = GM_getValue(
  "light_theme_cache",
  null
);

export let darkThemeCache: string | null = GM_getValue(
  "dark_theme_cache",
  null
);

////console.timeEnd("load theme cache");

// -1 auto 0 light 1 dark
export let currentThemeMode = GM_getValue("theme_id", -1);

export const setLightTheme = (theme: PlusTheme) => {
  if (lightTheme != theme) lightThemeCache = null;
  lightTheme = theme;

  GM_setValue("light_theme", lightTheme);
  GM_setValue("light_theme_cache", lightThemeCache);

  applyTheme();
};

export const setDarkTheme = (theme: PlusTheme) => {
  if (darkTheme != theme) darkThemeCache = null;
  darkTheme = theme;

  GM_setValue("dark_theme", darkTheme);
  GM_setValue("dark_theme_cache", darkThemeCache);

  applyTheme();
};

export const getPrimaryColor = () => {
  const [red, blue, green] = GM_getValue("primary_color", [0, 0, 0]);

  return {
    red,
    blue,
    green,
  };
};

export const toHex = ({
  red,
  green,
  blue,
}: {
  red: number;
  blue: number;
  green: number;
}) => [red, blue, green].map((x) => x.toString(16).padStart(2, "0")).join("");

export const setPrimaryColor = (red: number, blue: number, green: number) => {
  GM_setValue("primary_color", [red, blue, green]);

  setPrimaryColorCSS(red, blue, green);
};

export const setPrimaryColorCSS = (
  red: number,
  blue: number,
  green: number
) => {
  //prettier-ignore
  primaryColorStyle.innerHTML =
      ":root {"
    +   "--primary-color: rgb(var(--primary-color-red), var(--primary-color-blue), var(--primary-color-green));"
    +   `--primary-color-red: ${red};`
    +   `--primary-color-blue: ${blue};`
    +   `--primary-color-green: ${green};`
    + "}"
};

export const parseHexColor = (hex: string): [number, number, number] => {
  return [
    ...hex
      .replace("#", "")
      .replace(/^([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/, "$1$1$2$2$3$3")
      .replace(/^([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/, "$1.$2.$3")
      .split(".")
      .map((x) => parseInt(x, 16)),
    0,
    0,
    0,
  ].slice(0, 3) as [number, number, number];
};

export const applyTheme = () => {
  //console.time("apply theme");
  //console.log(lightTheme, darkTheme);

  const viewThemeId =
    currentThemeMode == -1
      ? +matchMedia("(prefers-color-scheme: dark)").matches
      : currentThemeMode;

  const theme = viewThemeId == 0 ? lightTheme : darkTheme;
  let cache = viewThemeId == 0 ? lightThemeCache : darkThemeCache;

  //console.log(viewThemeId, currentThemeMode);

  //console.log(cache);

  if (theme.style.type == "inline") {
    themeElement.innerHTML = theme.style.value;
  } else if (cache) {
    themeElement.innerHTML = cache;
  } else {
    queueMicrotask(async () => {
      const res = await GM.xmlHttpRequest<string>({ url: theme.style.value });

      const css = res.responseText;

      if (viewThemeId == 0) {
        lightThemeCache = cache = css;
      } else {
        darkThemeCache = cache = css;
      }

      themeElement.innerHTML = cache;
    });
  }

  GM_setValue("theme_id", currentThemeMode);

  ////console.timeEnd("apply theme");
};

export const installThemeBase = () => {
  //console.time("load primary color");

  //console.time("get primary color");
  const color = getPrimaryColor();
  ////console.timeEnd("get primary color");

  //console.time("set primary color css");
  setPrimaryColorCSS(color.red, color.blue, color.green);
  ////console.timeEnd("set primary color css");

  ////console.timeEnd("load primary color");

  applyTheme();

  ////console.timeEnd("theme draw start");

  requestAnimationFrame(() => {
    //console.time("put theme mode button");

    const themeList = document.createElement("select");
    const listContent = [
      ["自動", -1],
      ["ライト", 0],
      ["ダーク", 1],
    ] as const;

    themeList.id = "taittsuu-plus-theme-list";

    themeList.append(
      ...listContent.map(([name, value]) => {
        const item = document.createElement("option");

        item.innerText = name;
        item.value = "" + value;
        if (value == currentThemeMode) {
          item.setAttribute("selected", "true");
        }

        return item;
      })
    );

    themeList.addEventListener("change", async () => {
      currentThemeMode = +themeList.selectedOptions[0].value;

      applyTheme();
    });

    $(".post-header-menu").append(themeList);

    ////console.timeEnd("put theme mode button");
  });
};
