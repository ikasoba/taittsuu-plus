console.log(globalThis, unsafeWindow);

//console.time("theme base");
import { installThemeBase } from "./theme/theme.js";

installThemeBase();
////console.timeEnd("theme base");
/*
//console.time("page router");
import { activatePageRouter } from "./PageRouter.js";

////console.timeEnd("page router");

//console.time("override Taittsu");
import "./pages/load.ts";
////console.timeEnd("override Taittsu");
*/

import avtivateTaitsuuPlusBase from "./taittsuu.js";

import { installReTweetButton } from "./components/retweet.js";
import { installTweetContentPlus } from "./components/tweet.js";
import { installTweetDialogPlus } from "./components/tweetDialog.js";
import { installBulkFollowButton } from "./components/bulkFollowButton.js";
import { installRightMenu } from "./components/RightMenu.js";
import { installProfileContentPlus } from "./components/profileContentPlus.js";
import { installColoredTaitsu } from "./components/coloredTaitsu.js";

queueMicrotask(async () => {
  //activatePageRouter();
  avtivateTaitsuuPlusBase();

  installReTweetButton();
  installTweetContentPlus();
  installProfileContentPlus();
  installTweetDialogPlus();
  installBulkFollowButton();

  installRightMenu();
  installColoredTaitsu();
});
