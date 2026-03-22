/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACTORS, MOODS } from "@/constants/game";
import { dedent } from "../../utils/dedent";
import { Alternative, AlternativeLine, CharacterMood } from "@/types";

type AlternativesBuilder = {
  alternatives: (...opts: Alternative[]) => AlternativeLine;
};

function createAlternativeTag(character: ACTORS, mood: MOODS) {
  return (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): AlternativesBuilder => {
    const text = dedent(strings, values).trim();
    const moods: CharacterMood[] = [{ character, mood }];
    const alternativeLine: AlternativeLine = {
      type: "alternatives",
      text,
      character,
      moods,
      alternatives: [],
    };
    return {
      alternatives: (...opts: Alternative[]) => ({
        ...alternativeLine,
        alternatives: opts,
      }),
    };
  };
}

export function createAlternatives(
  characters: ACTORS[],
  moods: MOODS[],
): Record<ACTORS, Record<MOODS, ReturnType<typeof createAlternativeTag>>> {
  const out: any = {};
  for (const character of characters) {
    out[character] = {};
    for (const mood of moods) {
      out[character][mood] = createAlternativeTag(character, mood);
    }
  }
  return out;
}
