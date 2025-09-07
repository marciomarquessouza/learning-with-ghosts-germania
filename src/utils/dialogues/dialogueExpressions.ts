/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHARACTERS, MOODS } from "@/constants/game";
import { dedent } from "../dedent";
import { DialogueLine } from "@/events/gameEvents";

function createDialogueTag(character: CHARACTERS, mood: MOODS) {
  return (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): DialogueLine => {
    const text = dedent(strings, values).trim();

    return {
      type: "dialogue",
      character,
      mood,
      text,
    };
  };
}

export function createDialogue(
  characters: CHARACTERS[],
  moods: MOODS[]
): Record<
  CHARACTERS,
  Record<MOODS, (s: TemplateStringsArray, ...v: unknown[]) => DialogueLine>
> {
  const out: any = {};
  for (const character of characters) {
    out[character] = {};
    for (const mood of moods) {
      out[character][mood] = createDialogueTag(character, mood);
    }
  }
  return out;
}
