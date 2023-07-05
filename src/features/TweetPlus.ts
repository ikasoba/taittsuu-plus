import { defineModule } from "../common/module.js";
import { installLikeButton } from "../components/like.js";
import { installReTweetButton } from "../components/retweet.js";
import { installTweetContentPlus } from "../components/tweet.js";

defineModule({
  main() {
    installLikeButton();
    installReTweetButton();
    installTweetContentPlus();
  },
  exports: {},
});
