import { onAddPost } from "./types/taittsuu.js";
import { Tweet, showTweetDialog } from "./tweet.js";
import { textLimit } from "./util.js";

export const installLikeButton = () => {
  onAddPost((postElem, post) => {
    const likeButton = postElem.find("button.post-like-button");

    // いいね機能が追加されてるなら上書きしない
    if (!likeButton.attr("onclick")?.match("誠意開発中です")) return;

    likeButton.attr("onclick", null);

    likeButton.on("click", (event) => {
      showLikeDialog(post);
    });
  });
};

export const showLikeDialog = (tweet: Tweet) => {
  showTweetDialog(
    `https://taittsuu.com/users/${tweet.user_screenname}/status/${tweet.id}\n` +
      `❤️ ${tweet.user_name} @${tweet.user_screenname}・${new Date(
        tweet.created_at
      ).toLocaleString()}\n` +
      textLimit(tweet.content, 50)
  );
};
