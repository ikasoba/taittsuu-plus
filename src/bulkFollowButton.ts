import { TaittsuClient } from "./TaittsuClient.js";
import { sleepAsync, toChunk } from "./util.js";

export const installBulkFollowButton = () => {
  if (
    !(
      location.pathname.endsWith("/followers") ||
      location.pathname.endsWith("/following")
    )
  )
    return;

  const title = $(".container-left > h3");
  const button = document.createElement("button");
  let next = 0;
  let count = 1;

  button.innerText = "すべてフォロー " + count;
  button.style.width = "7rem";
  button.style.float = "right";

  title.append(button);

  button.addEventListener("click", async () => {
    button.disabled = true;

    const userId = location.pathname.match(/^\/users\/([a-zA-Z_0-9]+)\//)?.[1];

    if (userId == null) return;

    button.innerText = `データ取得中`;

    const res = await (location.pathname.endsWith("following")
      ? TaittsuClient.getFollowings(userId, next)
      : TaittsuClient.getFollowers(userId, next));

    const list = res.data;

    let i = 0;

    for (const chunk of toChunk(list, 5)) {
      for (const user of chunk) {
        if (user.screen_name == TaittsuClient.curentUserId) continue;

        await TaittsuClient.follow(user.screen_name);
        button.innerText = `${(i += 1)}/${list.length}`;

        await sleepAsync((1000 * 3) / 5);
      }
    }

    if (list.length == 0 || res.next == 0) {
      button.innerText = "すべてフォローしました";
      return;
    }

    button.innerText = "休憩中";

    await sleepAsync(1000 * 3);

    button.innerText = `すべてフォロー ${(count += 1)}`;

    button.disabled = false;
  });
};
