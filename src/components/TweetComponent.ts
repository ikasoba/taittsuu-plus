import { post } from "jquery";
import { TaittsuClient } from "../TaittsuClient.js";
import { dyeingTaitsu } from "./coloredTaitsu.js";

export function TweetComponent(userId: string, id: string) {
  const postElem = $("#postBaseElemWrap").children("div:first").clone();
  postElem.find(".post-user-name-value")[0].innerText = "loading...";
  postElem.find(".post-user-badge")[0].style.display = "none";
  postElem.find(".post-user-tid")[0].innerText = "loading...";
  postElem.find(".post-content")[0].innerText = "loading...";

  postElem.find(".post-button").remove();

  const wrapper = $("<div></div>");
  wrapper.css("border", "1px solid lightgray");
  wrapper.css("border-radius", "0.5rem");
  wrapper.css("margin", "0.25rem");
  wrapper.css("padding", "0.25rem");
  wrapper.css("overflow", "hidden");
  wrapper.append(postElem);

  queueMicrotask(async () => {
    const post = await TaittsuClient.getPost(id);

    postElem.find(".post-user-name-value")[0].innerText = post.user_name;

    dyeingTaitsu(postElem, post);

    if (post.is_verified) {
      postElem.find(".post-user-badge")[0].style.display = "";
    }

    postElem.find(".post-user-tid")[0].innerText = "@" + post.user_screenname;
    postElem.find(".post-content")[0].innerText = post.content;
    let createdAt = new Date(post.created_at);
    postElem.find(".post-time")[0].innerText = createdAt.toLocaleString();

    postElem
      .find(".post-link-user")
      .attr("href", "/users/" + post.user_screenname);
    postElem
      .find(".post-link-post")
      .attr("href", "/users/" + post.user_screenname + "/status/" + post.id);
  });

  return wrapper[0];
}
