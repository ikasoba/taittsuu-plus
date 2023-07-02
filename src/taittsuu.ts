import { Tweet } from "./tweet.js";

export type AddPostHandler = (
  postElem: JQuery<HTMLElement>,
  post: Tweet,
  postsElem: JQuery<HTMLElement>
) => void;

const onAddPostHandler: Set<AddPostHandler> = new Set();

export const onAddPost = (fn: AddPostHandler) => {
  onAddPostHandler.add(fn);
};

export const removeAddPostHandler = (fn: AddPostHandler) => {
  onAddPostHandler.delete(fn);
};

console.log("install addPost");
Taittsuu.Post.addPost = function (postsElem, post) {
  const postElem = $("#postBaseElemWrap").children("div:first").clone();
  postElem.find(".post-user-name-value")[0].innerText = post.user_name;
  if (!post.is_verified) {
    postElem.find(".post-user-badge")[0].style.display = "none";
  }
  postElem.find(".post-user-tid")[0].innerText = "@" + post.user_screenname;
  postElem.find(".post-content")[0].innerText = post.content;
  let createdAt = new Date(post.created_at);
  postElem.find(".post-time")[0].innerText = createdAt.toLocaleString();

  (postElem.find(".post-link-user")[0] as HTMLAnchorElement).href =
    "/users/" + post.user_screenname;
  (postElem.find(".post-link-post")[0] as HTMLAnchorElement).href =
    "/users/" + post.user_screenname + "/status/" + post.id;

  for (const fn of onAddPostHandler) {
    fn(postElem, post, postsElem);
  }

  postsElem.append(postElem);
};
