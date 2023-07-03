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

  button.innerText = "すべてフォロー";
  button.style.width = "7rem";
  button.style.float = "right";

  title.append(button);

  button.addEventListener("click", async () => {
    button.disabled = true;

    const userId = location.pathname.match(/^\/users\/([a-zA-Z_0-9]+)\//)?.[1];

    if (userId == null) return;

    button.innerText = `データ取得中`;

    const list = await (location.pathname.endsWith("following")
      ? TaittsuClient.getAllFollowings(userId)
      : TaittsuClient.getAllFollowers(userId));

    let i = 0;

    for (const chunk of toChunk(list, 5)) {
      await Promise.all(
        chunk.map(async (user) => {
          if (user.screen_name == TaittsuClient.curentUserId) return;

          await TaittsuClient.follow(user.screen_name);
          button.innerText = `${i}/${list.length}`;
        })
      );
      await sleepAsync(1000);
    }

    button.innerText = "休憩中";

    await sleepAsync(1000 * 30);

    button.innerText = "すべてフォロー";

    button.disabled = false;
  });
};
