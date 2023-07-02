//@ts-ignore
import autoCss from "./auto.css" assert { type: "text" };

export const installAutoTheme = () => {
  const style = document.createElement("style");
  style.innerHTML = autoCss;
  document.head.append(style);
};
