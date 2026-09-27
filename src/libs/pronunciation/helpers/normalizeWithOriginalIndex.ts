export function normalizeWithOriginalIndex(text: string) {
  return Array.from(text).flatMap((character, originalIndex) => {
    const normalized = character
      .toLowerCase()
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

    return Array.from(normalized)
      .filter((char) => /[\p{L}\p{N}]/u.test(char))
      .map((char) => ({
        character: char,
        originalIndex,
      }));
  });
}
