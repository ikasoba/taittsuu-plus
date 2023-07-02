import { Tweet } from "../src/tweet.ts";

export interface Taittsuu {
  ApiKey: string;
  Post: {
    showTaiitsuDialog(): void;
    hideTaiitsuDialog(): void;
    addPost(postsElm: JQuery<HTMLElement>, post: Tweet): void;
  };

  User: {
    addUser(postsElm: JQuery<HTMLElement>, post: User);
  };
}

declare global {
  declare var Taittsuu: Taittsuu;
}
