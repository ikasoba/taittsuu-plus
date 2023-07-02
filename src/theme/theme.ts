//@ts-ignore
import themeBaseCss from "./theme-base.css";

export const installThemeBase = () => {
  const style = document.createElement("style");
  style.innerHTML = themeBaseCss;
  document.head.append(style);
};
