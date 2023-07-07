import { onAddPost } from "../taittsuu.js";
import { Tweet } from "../types/Tweet.js";
import { showTweetDialog } from "./tweet.js";
import { textLimit } from "../util.js";
import { createPopper } from "@popperjs/core";

export const installReTweetButton = () => {
  onAddPost((postElem, post) => {
    const retweetButton = postElem.find("button.post-rt-button");

    const tooltip = $('<div hidden class="tp-container tp-flex-col"></div>')
      .css("gap", "0.25rem")
      .append(
        $("<button>リタイーツ</button>").on("click", () => {
          Taittsuu.Post.reTaiitsu(retweetButton);
          tooltip.attr("hidden", "");
          popper.update();
        })
      )
      .append(
        $("<button>引用リタイーツ</button>").on("click", () => {
          showRetweetDialog(post);
          tooltip.attr("hidden", "");
          popper.update();
        })
      )
      .append(
        $("<button>閉じる</button>").on("click", () => {
          tooltip.attr("hidden", "");
          popper.update();
        })
      );

    const popper = createPopper(retweetButton[0], tooltip[0], {
      placement: "bottom",
    });

    retweetButton.attr("onclick", null);

    retweetButton.on("click", (event) => {
      if (tooltip.attr("hidden") != null) {
        tooltip.attr("hidden", null);
        popper.update();
      } else {
        tooltip.attr("hidden", "");
        popper.update();
      }
    });

    document.body.append(tooltip[0]);
  });
};

export const showRetweetDialog = (tweet: Tweet) => {
  showTweetDialog(
    `\n\https://taittsuu.com/users/${tweet.user_screenname}/status/${tweet.id}`
  );
};
