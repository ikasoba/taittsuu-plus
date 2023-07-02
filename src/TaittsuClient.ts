import { User } from "./User.js";
import { Tweet } from "./tweet.js";

export class TaittsuClient {
  static currentUserFollowingList: { data: User[]; next: number } = {
    data: [],
    next: 0,
  };

  static getPost(id: string): Promise<Tweet> {
    return fetch(`https://taittsuu.com/api/v0.1/taiitsus/${id}`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
      },
      method: "GET",
    })
      .then((x) => x.json())
      .then((x) => x.data[0]);
  }

  static getFollowings(
    id: string,
    next?: number
  ): Promise<{ data: User[]; next: number }> {
    return fetch(`https://taittsuu.com/api/v0.1/users/${id}/following`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
      },
      method: "GET",
      body: new URLSearchParams({ next: `${next || ""}` }),
    }).then((x) => x.json());
  }

  static getFollowers(
    id: string,
    next?: number
  ): Promise<{ data: User[]; next: number }> {
    return fetch(`https://taittsuu.com/api/v0.1/users/${id}/followers`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
      },
      method: "GET",
      body: new URLSearchParams({ next: `${next || ""}` }),
    }).then((x) => x.json());
  }

  static fetch(path: string) {
    return fetch(`https://taittsuu.com/api/v0.1/${path}`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
      },
      method: "GET",
    }).then((x) => x.json());
  }

  static async isFollowed(youId: string, userId: string): Promise<boolean> {
    if (this.currentUserFollowingList.data.find((x) => x.screen_name == userId))
      return true;

    const following = await this.getFollowings(
      youId,
      this.currentUserFollowingList.next
    );

    this.currentUserFollowingList.data.push(...following.data);

    this.currentUserFollowingList.next = following.next;

    return this.isFollowed(youId, userId);
  }
}

(globalThis as any).TaittsuuClient = TaittsuClient;
