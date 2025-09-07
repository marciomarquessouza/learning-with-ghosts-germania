/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHARACTERS, MOODS } from "@/constants/game";
import { Alternative, AlternativeLine } from "@/events/gameEvents";
import { dedent } from "../dedent";

type AlternativesBuilder = {
  alternatives: (
    ...opts: Alternative[]
  ) => (onSubmitted: (alternativeId?: string) => void) => AlternativeLine;
};

function createAlternativeTag(character: CHARACTERS, mood: MOODS) {
  return (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): AlternativesBuilder => {
    const text = dedent(strings, values).trim();
    return {
      alternatives:
        (...opts: Alternative[]) =>
        (onSubmitted: (alternativeId?: string) => void) => ({
          type: "alternatives",
          text,
          character,
          mood,
          alternatives: opts,
          onSubmitted,
        }),
    };
  };
}

export function createAlternatives(
  characters: CHARACTERS[],
  moods: MOODS[]
): Record<CHARACTERS, Record<MOODS, ReturnType<typeof createAlternativeTag>>> {
  const out: any = {};
  for (const character of characters) {
    out[character] = {};
    for (const mood of moods) {
      out[character][mood] = createAlternativeTag(character, mood);
    }
  }
  return out;
}
