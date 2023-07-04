export const textLimit = (text: string, max: number) =>
  text.length >= max ? text.slice(0, max - 3) + "..." : text;

export const toChunk = <T>(arr: T[], length: number): T[][] => {
  const tmp = [...arr];
  const res = [];

  while (tmp.length) {
    res.push(tmp.splice(0, length));
  }

  return res;
};

export const sleepAsync = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

export function escapeHTML(src: string) {
  return src.replace(
    /[&'`"<>]/g,
    (m) => "&x" + m.charCodeAt(0).toString(16) + ";"
  );
}

export const h = (src: TemplateStringsArray, ...items: string[]) => {
  return src
    .map((x, i) => (i < src.length - 1 ? x + escapeHTML(items[i]) : x))
    .join("");
};
