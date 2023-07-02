import { installThemeBase } from "./theme/theme.js";
import { installAutoTheme } from "./theme/auto.js";
installThemeBase();

import "./taittsuu.js";
import { installReTweetButton } from "./retweet.js";
import { installTweetContentPlus } from "./tweet.js";
import { installTweetDialogPlus } from "./tweetDialog.js";

installReTweetButton();
installTweetContentPlus();
installTweetDialogPlus();
installAutoTheme();
