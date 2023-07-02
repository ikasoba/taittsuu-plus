import { Tweet } from "./tweet.js";

export class TaittsuClient {
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
}
