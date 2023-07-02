import { onAddPost } from "./taittsuu.js";
import { Tweet, showTweetDialog } from "./tweet.js";
import { textLimit } from "./util.js";

export const installReTweetButton = () => {
  onAddPost((postElem, post) => {
    const retweetButton = postElem.find("button.post-rt-button");
    retweetButton.attr("onclick", null);

    retweetButton.on("click", (event) => {
      showRetweetDialog(post);
    });
  });
};

export const showRetweetDialog = (tweet: Tweet) => {
  showTweetDialog(
    `https://taittsuu.com/users/${tweet.user_screenname}/status/${tweet.id}\n` +
      `🔁 ${tweet.user_name} @${tweet.user_screenname}・${new Date(
        tweet.created_at
      ).toLocaleString()}\n` +
      textLimit(tweet.content, 50)
  );
};
