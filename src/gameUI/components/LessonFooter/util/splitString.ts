export function splitString(text: string, limit: number): string[] {
  if (text.length <= limit) {
    return [text];
  }

  const searchEnd = Math.min(limit, text.length) - 1;
  let bestIndex = -1;
  let delimiter = "";

  for (let i = searchEnd; i >= 0; i--) {
    if (text[i] === ".") {
      const isEllipsis = text[i - 1] === "." || text[i + 1] === ".";

      if (!isEllipsis) {
        bestIndex = i;
        break;
      }
    }
  }

  if (bestIndex === -1) {
    for (let i = searchEnd; i >= 2; i--) {
      if (text[i] === "." && text[i - 1] === "." && text[i - 2] === ".") {
        bestIndex = i;
        delimiter = "...";
        break;
      }
    }
  }

  if (bestIndex === -1) {
    for (let i = searchEnd; i >= 0; i--) {
      if (text[i] === ",") {
        bestIndex = i;
        delimiter = ",";
        break;
      }
    }
  }

  if (bestIndex !== -1) {
    const firstPart = text.slice(0, bestIndex + 1);

    let nextIndex = bestIndex + 1;
    while (nextIndex < text.length && text[nextIndex] === " ") {
      nextIndex++;
    }

    const remaining = text.slice(nextIndex);
    return [firstPart, ...splitString(remaining, limit)];
  }

  const firstPart = text.slice(0, limit);
  let nextIndex = limit;
  while (nextIndex < text.length && text[nextIndex] === " ") {
    nextIndex++;
  }
  const remaining = text.slice(nextIndex);
  return [firstPart, ...splitString(remaining, limit)];
}

export function splitStringsByLimit(
  strings: string[],
  limit: number = 100,
): string[] {
  const result: string[] = [];

  for (const str of strings) {
    result.push(...splitString(str, limit));
  }

  return result;
}
