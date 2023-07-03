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
