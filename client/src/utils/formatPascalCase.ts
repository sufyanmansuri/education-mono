export function formatPascalCase(text: string): string {
  let value = text;
  if (!value[0].match(/^[A-Za-z]/)) {
    value = value.slice(1);
  }
  const index = value.search(/[A-Z]/);
  const temp = value.split("");
  temp[index] = " " + value[index];
  value = temp.join("");
  if (!value[0].match(/^[A-Z]/)) {
    value = value[0].toUpperCase() + value.slice(1);
  }
  return value;
}
