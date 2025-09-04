/**
 * Removes indentation from multiline strings. Works with both tabs and spaces.
 * @param TemplateStringsArray
 * @param any[]
 * @returns string
 */
export function dedent(strings: TemplateStringsArray, values: unknown[]) {
  let full = strings.reduce(
    (acc, s, i) => acc + s + (i < values.length ? values[i] : ""),
    ""
  );

  full = full.replace(/\r\n/g, "\n");
  const lines = full.split("\n");

  // remove leading and trailing blank lines
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^(\s+)/)?.[1].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;

  return lines.map((l) => l.slice(min)).join("\n");
}
