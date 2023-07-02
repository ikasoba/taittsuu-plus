export const textLimit = (text: string, max: number) =>
  text.length >= max ? text.slice(0, max - 3) + "..." : text;
