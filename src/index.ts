import { installThemeBase } from "./theme/theme.js";
import { installAutoTheme } from "./theme/auto.js";
installThemeBase();
installAutoTheme();

import avtivateTaitsuuPlusBase from "./taittsuu.js";

import { installReTweetButton } from "./retweet.js";
import { installTweetContentPlus } from "./tweet.js";
import { installTweetDialogPlus } from "./tweetDialog.js";
import { installBulkFollowButton } from "./bulkFollowButton.js";
import { installSearchBar } from "./searchBar.js";
import { installProfileContentPlus } from "./profileContentPlus.js";

queueMicrotask(async () => {
  avtivateTaitsuuPlusBase();

  installReTweetButton();
  installTweetContentPlus();
  installProfileContentPlus();
  installTweetDialogPlus();
  installBulkFollowButton();

  installSearchBar();
});
