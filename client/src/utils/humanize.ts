export function humanize(text: string, isKebab = false): string {
  if (text === "_id") return "Id";
  if (isKebab)
    return text
      .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
      .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());
  return text[0].toUpperCase() + text.replace(/([A-Z])/g, " $1").slice(1);
}
