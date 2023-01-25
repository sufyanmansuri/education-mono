export function pick(keys: string[], obj: any) {
  const newObj: any = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });

  return newObj;
}
