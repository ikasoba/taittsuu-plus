import { TaittsuDown } from "../TaittsuDown.js";
import { onAddUser } from "../taittsuu.js";

export const installProfileContentPlus = () => {
  onAddUser((elm) => {
    TaittsuDown.render(elm.find(".post-content")[0]);
  });
};
