export const omit = (keys: string[], obj: object) =>
  Object.fromEntries(Object.entries(obj).filter((e) => !keys.includes(e[0])));
