import { ImageComponent } from "./ImageComponent.js";
import { TweetComponent } from "./TweetComponent.js";
import { onAddPost } from "./taittsuu.js";

export const showTweetDialog = (content?: string) => {
  if (content != null) {
    (document.getElementById("taiitsuInput") as HTMLTextAreaElement)!.value =
      content;
  }

  Taittsuu.Post.showTaiitsuDialog();
};

export interface Tweet {
  content: string;
  created_at: string;
  id: number;
  is_verified: number;
  user_name: string;
  user_screenname: string;
}

type Transformer = (
  node: Node,
  current: { value: Node },
  i: { value: number },
  content: HTMLElement,
  attachments: { value: HTMLElement[] }
) => boolean;

export const createMention = (
  node: Node,
  current: { value: Node },
  i: { value: number },
  content: HTMLElement,
  attachments: { value: HTMLElement[] }
): boolean => {
  if (!(current.value instanceof Text)) {
    return false;
  }

  const m = current.value.textContent?.match(/@[a-zA-Z_0-9]+/d);
  if (!m) {
    return false;
  }

  const offset = m?.indices?.[0][0]!;
  const length = m?.indices?.[0][1]! - offset;

  const userIdNode = current.value.splitText(offset);
  current.value = userIdNode.splitText(length);

  const userIdAnchor = document.createElement("a");
  userIdAnchor.href = `https://taittsuu.com/users/${userIdNode.textContent?.slice(
    1
  )}`;
  userIdAnchor.innerText = userIdNode.textContent ?? "@unknown";

  content.replaceChild(userIdAnchor, userIdNode);

  i.value += 1;

  return true;
};

export const createAttachment = (
  node: Node,
  current: { value: Node },
  i: { value: number },
  content: HTMLElement,
  attachments: { value: HTMLElement[] }
): boolean => {
  console.log(current);

  if (!(current.value instanceof HTMLAnchorElement)) {
    return false;
  }

  const urlText = current.value.href;

  try {
    const url = new URL(urlText);

    console.log(url);

    if (url.pathname.match(/\.(?:a?png|jpe?g|webp|gif|bmp)/)) {
      attachments.value.push(ImageComponent(urlText));
    } else if (url.hostname == "taittsuu.com") {
      const tweet = url.pathname.match(
        /^\/users\/[a-zA-Z_0-9]+\/status\/([0-9]+)/
      );
      if (tweet) {
        attachments.value.push(TweetComponent(tweet[1]));
      }
    }
  } catch (_) {}

  return true;
};

export const createBold = (
  node: Node,
  current: { value: Node },
  i: { value: number },
  content: HTMLElement,
  attachments: { value: HTMLElement[] }
): boolean => {
  if (!(current.value instanceof Text)) {
    return false;
  }

  const m = current.value.textContent?.match(/\*\*?(\\*|[^*])*\*?\*/d);
  if (!m) {
    return false;
  }

  const offset = m?.indices?.[0][0]!;
  const length = m?.indices?.[0][1]! - offset;

  const textNode = current.value.splitText(offset);
  current.value = textNode.splitText(length);

  const bold = document.createElement("span");
  bold.style.fontWeight = "bold";
  bold.innerText = textNode.textContent!;

  content.replaceChild(bold, textNode);

  i.value += 1;

  return true;
};

export const createItalic = (
  node: Node,
  current: { value: Node },
  i: { value: number },
  content: HTMLElement,
  attachments: { value: HTMLElement[] }
): boolean => {
  if (!(current.value instanceof Text)) {
    return false;
  }

  const m = current.value.textContent?.match(/__?(\\_|[^_])*_?_/d);
  if (!m) {
    return false;
  }

  const offset = m?.indices?.[0][0]!;
  const length = m?.indices?.[0][1]! - offset;

  const textNode = current.value.splitText(offset);
  current.value = textNode.splitText(length);

  const bold = document.createElement("span");
  bold.style.fontStyle = "italic";
  bold.innerText = textNode.textContent!;

  content.replaceChild(bold, textNode);

  i.value += 1;

  return true;
};

export const choice =
  (transformers: Transformer[]): Transformer =>
  (
    node: Node,
    current: { value: Node },
    i: { value: number },
    content: HTMLElement,
    attachments
  ) => {
    const prevCurrent = current.value;
    const prevIndex = i.value;

    for (const t of transformers) {
      if (t(node, current, i, content, attachments)) {
        return true;
      } else {
        current.value = prevCurrent;
        i.value = prevIndex;
      }
    }

    return false;
  };

export const installTweetContentPlus = () => {
  onAddPost((postElem, post) => {
    const content = postElem.find(".post-content")[0];
    const contentWrap = content.parentElement!;
    const attachments = { value: [] };
    for (let i = 0; i < content.childNodes.length; i++) {
      const node = content.childNodes[i];

      let current: Node = node;

      const currentRef = { value: current };
      const indexRef = { value: i };

      choice([createMention, createAttachment, createBold, createItalic])(
        node,
        currentRef,
        indexRef,
        content,
        attachments
      );

      current = currentRef.value;
      if (i == indexRef.value) {
        i++;
      } else {
        i = indexRef.value;
      }
    }

    console.log(attachments, contentWrap);

    if (attachments.value.length) {
      contentWrap.after(Attachments(attachments.value));
    }
  });
};

export function Attachments(attachments: HTMLElement[]) {
  attachments = attachments.slice(0, 4);

  const container = document.createElement("div");

  container.style.borderRadius = "0.5rem";
  container.style.width = "100%";
  container.style.aspectRatio = "16 / 9";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fit, minmax(50%, 1fr)";
  container.style.gridTemplateRows = "repeat(auto-fit, minmax(50%, 1fr)";

  container.append(...attachments);

  return container;
}
