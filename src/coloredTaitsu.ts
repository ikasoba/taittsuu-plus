import { onAddPost } from "./taittsuu.js";

export const calcTaitsuColor = (hue: number, contrast?: number | null) => {
  return `sepia(1) hue-rotate(${(315 + hue) % 360}deg) contrast(${
    contrast ?? 1.25
  }) saturate(4.5)`;
};

export const circleEmojis = [
  "🔴",
  "🟠",
  "🟡",
  "🟢",
  "🔵",
  "🟣",
  "🟤",
  "⚫",
  "⚪",
] as const;

export const colorMap: {
  [K in (typeof circleEmojis)[number]]: [number, number | null];
} = {
  "🔴": [0, null],
  "🟠": [35, null],
  "🟡": [60, null],
  "🟢": [120, null],
  "🔵": [240, null],
  "🟣": [300, null],
  "🟤": [35, 0.35],
  "⚫": [0, 0],
  "⚪": [70, 50],
};

type a = [...(typeof colorMap)[keyof typeof colorMap]];

export const installColoredTaitsu = () => {
  onAddPost((postElem, post) => {
    const username = postElem.find(".post-user-name-value");
    const image = postElem.find(".profile-image");

    const color: null | (typeof circleEmojis)[number] = username
      .text()
      .match(new RegExp(`[!！](${circleEmojis.join("|")})`))?.[1] as any;
    if (color == null) return;

    image.css("filter", calcTaitsuColor(...colorMap[color]));
  });
};
