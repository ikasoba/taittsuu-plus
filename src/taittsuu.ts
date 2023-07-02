import { User } from "./User.js";
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

export type AddUserHandler = (
  postElem: JQuery<HTMLElement>,
  post: User,
  postsElem: JQuery<HTMLElement>
) => void;

const onAddUserHandler: Set<AddPostHandler> = new Set();

export const AddUser = (fn: AddPostHandler) => {
  onAddPostHandler.add(fn);
};

export const removeAddUserHandler = (fn: AddPostHandler) => {
  onAddPostHandler.delete(fn);
};

const addPost = Taittsuu.Post.addPost;
Taittsuu.Post.addPost = function (postsElem, post) {
  let postElem: JQuery<HTMLElement>;

  const postsElemProxy = new Proxy(postsElem, {
    get(_, key, __) {
      if (key == "append") {
        return (...a: any[]) => {
          postElem = a[0];

          for (const fn of onAddPostHandler) {
            fn(postElem, post, postsElem);
          }

          postsElem.append(...a);
        };
      } else {
        return postsElem[key as any];
      }
    },
  });

  addPost(postsElemProxy, post);
};

const addUser = Taittsuu.User.addUser;
Taittsuu.User.addUser = function (postsElem, post) {
  let postElem: JQuery<HTMLElement>;

  const postsElemProxy = new Proxy(postsElem, {
    get(_, key, __) {
      if (key == "append") {
        return (...a: any[]) => {
          postElem = a[0];

          for (const fn of onAddPostHandler) {
            fn(postElem, post, postsElem);
          }

          postsElem.append(...a);
        };
      } else {
        return postsElem[key as any];
      }
    },
  });

  addUser(postsElemProxy, post);
};
