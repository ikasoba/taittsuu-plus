//@ts-ignore
import autoDarkCss from "./auto-dark.css" assert { type: "text" };

//@ts-ignore
import autoLightCss from "./auto-light.css" assert { type: "text" };
import { applyTheme, setDarkTheme, setLightTheme } from "./theme.js";

export const installAutoTheme = () => {
  setLightTheme(autoLightCss);
  setDarkTheme(autoDarkCss);
};
