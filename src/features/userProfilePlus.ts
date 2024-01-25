import { TaittsuDown } from "../TaittsuDown.js";
import { dyeingProfileTaitsu } from "../components/coloredTaitsu.js";

export function installUserProfilePlus() {
  if (!location.pathname.startsWith("/users/")) return;

  dyeingProfileTaitsu($(".profile-wrap"));
}
