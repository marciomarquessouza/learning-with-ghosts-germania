/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHARACTERS, MOODS } from "@/constants/game";
import { dedent } from "./dedent";

export interface DialogueLine {
  id?: string;
  character: CHARACTERS;
  mood: MOODS;
  text: string;
}

function createDialogueTag(character: CHARACTERS, mood: MOODS) {
  return (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): DialogueLine => {
    const text = dedent(strings, values).trim();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return { id, character, mood, text };
  };
}

export function createDialogue(
  characters: CHARACTERS[],
  moods: MOODS[]
): Record<
  CHARACTERS,
  Record<MOODS, (s: TemplateStringsArray, ...v: any[]) => DialogueLine>
> {
  const out: any = {};
  for (const c of characters) {
    out[c] = {};
    for (const m of moods) {
      out[c][m] = createDialogueTag(c, m);
    }
  }
  return out;
}

const dialogue = createDialogue(
  Object.values(CHARACTERS),
  Object.values(MOODS)
);

/**
 * example usage:
 * import dialogue from "@/utils/dialogueExpressions";
 *
 *import dialogue from "@/utils/dialogueExpressions";
 *
 * export const dialogues = {
 * welcome: [
 *   dialogue.josef.sad`
 *     This cell is my new home.
 *     I was jailed for not speaking German in Germany.
 *     Logic... or absurdity?
 *   `,
 */
export default dialogue;
