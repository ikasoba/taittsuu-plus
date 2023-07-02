import { Tweet } from "../src/tweet.ts";

export interface Taittsuu {
  Post: {
    showTaiitsuDialog(): void
    hideTaiitsuDialog(): void
    addPost(postsElm: JQuery<HTMLElement>, post: Tweet): void
  }
}

declare global {
  declare var Taittsuu: Taittsuu;
}