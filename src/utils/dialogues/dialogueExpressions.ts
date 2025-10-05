/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHARACTERS, MOODS } from "@/constants/game";
import { dedent } from "../dedent";
import { CharacterMood, DialogueLine } from "@/types";

interface DialogueTag extends DialogueLine {
  reactions: (charactersMood: CharacterMood[]) => DialogueLine;
}

function createDialogueTag(character: CHARACTERS, mood: MOODS) {
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
  characters: CHARACTERS[],
  moods: MOODS[]
): Record<
  CHARACTERS,
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
