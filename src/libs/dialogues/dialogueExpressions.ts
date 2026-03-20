/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACTORS, MOODS } from "@/constants/game";
import { dedent } from "../../utils/dedent";
import { CharacterMood, DialogueLine } from "@/types";

interface DialogueTag extends DialogueLine {
  reactions: (charactersMood: CharacterMood[]) => DialogueLine;
}

function createDialogueTag(character: ACTORS, mood: MOODS) {
  return (strings: TemplateStringsArray, ...values: unknown[]): DialogueTag => {
    const text = dedent(strings, values).trim();
    const moods: CharacterMood[] = [{ character, mood }];
    const dialogueLine = Object.freeze({
      type: "dialogue",
      character,
      moods,
      text,
    });

    return {
      ...dialogueLine,
      reactions: (charactersMood) => ({
        ...dialogueLine,
        moods: [...moods, ...charactersMood],
      }),
    };
  };
}

export function createDialogue(
  characters: ACTORS[],
  moods: MOODS[],
): Record<
  ACTORS,
  Record<MOODS, (s: TemplateStringsArray, ...v: unknown[]) => DialogueTag>
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
