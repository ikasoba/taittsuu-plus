import type { Taittsuu } from "../types/taittsuu.js";
import { User } from "./User.js";
import { Tweet } from "./types/Tweet.js";

declare global {
  var $tpOnAddPostHandler: Set<AddPostHandler>;
  var $tpOnAddUserHandler: Set<AddUserHandler>;
}

export type AddPostHandler = (
  postElem: JQuery<HTMLElement>,
  post: Tweet,
  postsElem: JQuery<HTMLElement>
) => void;

const onAddPostHandler: Set<AddPostHandler> =
  globalThis.$tpOnAddPostHandler ??
  (globalThis.$tpOnAddPostHandler = new Set());

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

const onAddUserHandler: Set<AddUserHandler> =
  globalThis.$tpOnAddUserHandler ??
  (globalThis.$tpOnAddUserHandler = new Set());

export const onAddUser = (fn: AddUserHandler) => {
  onAddUserHandler.add(fn);
};

export const removeAddUserHandler = (fn: AddUserHandler) => {
  onAddUserHandler.delete(fn);
};

let Taittsuu: Taittsuu | null;
export default () => {
  if (unsafeWindow.Taittsuu == null) {
    Taittsuu = null;
  } else {
    Taittsuu = unsafeWindow.Taittsuu;
  }

  if (Taittsuu) {
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
  }

  if (Taittsuu) {
    const addUser = Taittsuu.User.addUser;
    Taittsuu.User.addUser = function (postsElem, post) {
      let postElem: JQuery<HTMLElement>;

      const postsElemProxy = new Proxy(postsElem, {
        get(_, key, __) {
          if (key == "append") {
            return (...a: any[]) => {
              postElem = a[0];

              for (const fn of onAddUserHandler) {
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
  }
};
