import { User } from "./User.js";
import cacheStorage from "./cacheStorage.js";
import { Tweet } from "./tweet.js";

export class TaittsuClient {
  static curentUserId = $("meta[name=my-screen-name]").attr("content")!;

  static currentUserFollowingList: { data: Set<string>; next?: number } = {
    data: new Set(),
    next: undefined,
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

  static async getFollowings(
    id: string,
    next?: number
  ): Promise<{ data: User[]; next: number }> {
    const req = new Request(
      `https://taittsuu.com/api/v0.1/users/${id}/following?${new URLSearchParams(
        { next: `${next || ""}` }
      ).toString()}`,
      {
        headers: {
          "X-API-KEY": Taittsuu.ApiKey,
          "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
          "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
        },
        method: "GET",
      }
    );

    let res: Response;
    const cache = await (await cacheStorage()).match(req);

    if (cache == null) {
      res = await fetch(req);

      await (await cacheStorage()).put(req, res);

      res = (await (await cacheStorage()).match(req))!;
    } else {
      res = cache;
    }

    return res.json();
  }

  static async getFollowers(
    id: string,
    next?: number
  ): Promise<{ data: User[]; next: number }> {
    const req = new Request(
      `https://taittsuu.com/api/v0.1/users/${id}/followers?${new URLSearchParams(
        { next: `${next || ""}` }
      ).toString()}`,
      {
        headers: {
          "X-API-KEY": Taittsuu.ApiKey,
          "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
          "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
        },
        method: "GET",
      }
    );

    let res: Response;
    const cache = await (await cacheStorage()).match(req);

    if (cache == null) {
      res = await fetch(req);

      await (await cacheStorage()).put(req, res);

      res = (await (await cacheStorage()).match(req))!;
    } else {
      res = cache;
    }

    return res.json();
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
    if (this.currentUserFollowingList.next == 0) {
      return !!this.currentUserFollowingList.data.has(userId);
    }
    if (this.currentUserFollowingList.data.has(userId)) return true;

    const following = await this.getFollowings(
      youId,
      this.currentUserFollowingList.next
    );

    if (following.data.length == 0 || following.next == 0) {
      following.next = 0;
      return false;
    }

    for (const user of following.data) {
      this.currentUserFollowingList.data.add(user.screen_name);
    }

    this.currentUserFollowingList.next = following.next;

    return this.isFollowed(youId, userId);
  }

  static async follow(userId: string) {
    await (
      await cacheStorage()
    ).delete(
      new URL(
        `https://taittsuu.com/api/v0.1/users/${this.curentUserId}/following?next=`
      )
    );

    await fetch(`https://taittsuu.com/api/v0.1/users/following`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        target_user_id: userId,
      }),
    });
  }

  static async unfollow(userId: string) {
    await fetch(`https://taittsuu.com/api/v0.1/users/following`, {
      headers: {
        "X-API-KEY": Taittsuu.ApiKey,
        "X-ACCESS-TOKEN": $("meta[name='access-token']").attr("content")!,
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")!,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        target_user_id: userId,
      }),
    });
  }
}

(globalThis as any).TaittsuuClient = TaittsuClient;
