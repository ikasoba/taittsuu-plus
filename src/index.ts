import { installThemeBase } from "./theme/theme.js";
import { activatePageRouter } from "./PageRouter.js";

installThemeBase();

activatePageRouter();

import "./pages/load.ts";

import avtivateTaitsuuPlusBase from "./taittsuu.js";

import { installReTweetButton } from "./retweet.js";
import { installTweetContentPlus } from "./tweet.js";
import { installTweetDialogPlus } from "./tweetDialog.js";
import { installBulkFollowButton } from "./bulkFollowButton.js";
import { installRightMenu } from "./RightMenu.js";
import { installProfileContentPlus } from "./profileContentPlus.js";
import { installColoredTaitsu } from "./coloredTaitsu.js";

queueMicrotask(async () => {
  avtivateTaitsuuPlusBase();

  installReTweetButton();
  installTweetContentPlus();
  installProfileContentPlus();
  installTweetDialogPlus();
  installBulkFollowButton();

  installRightMenu();
  installColoredTaitsu();
});
