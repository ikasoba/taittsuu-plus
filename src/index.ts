//console.time("theme base");
import { installThemeBase } from "./theme/theme.js";

installThemeBase();
////console.timeEnd("theme base");

//console.time("page router");
import { activatePageRouter } from "./PageRouter.js";

////console.timeEnd("page router");

//console.time("override Taittsu");
import "./pages/load.ts";
////console.timeEnd("override Taittsu");

import avtivateTaitsuuPlusBase from "./taittsuu.js";

import { installReTweetButton } from "./retweet.js";
import { installTweetContentPlus } from "./tweet.js";
import { installTweetDialogPlus } from "./tweetDialog.js";
import { installBulkFollowButton } from "./bulkFollowButton.js";
import { installRightMenu } from "./RightMenu.js";
import { installProfileContentPlus } from "./profileContentPlus.js";
import { installColoredTaitsu } from "./coloredTaitsu.js";

queueMicrotask(async () => {
  activatePageRouter();
  avtivateTaitsuuPlusBase();

  installReTweetButton();
  installTweetContentPlus();
  installProfileContentPlus();
  installTweetDialogPlus();
  installBulkFollowButton();

  installRightMenu();
  installColoredTaitsu();
});
