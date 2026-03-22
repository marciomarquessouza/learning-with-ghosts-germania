import {
  AlternativeLine,
  BaseLine,
  DialogueLine,
  InputLine,
  InteractionLine,
} from "@/types";

export function parseDialogueLines(
  dialogue: Record<string, () => InteractionLine[]>,
): Record<string, InteractionLine[]> {
  const interactions: Record<string, InteractionLine[]> = {};
  Object.keys(dialogue).forEach((key) => {
    const rawInteractions = dialogue[key]();
    interactions[key] = rawInteractions.map((item) => {
      const baseLine: BaseLine = {
        text: item.text,
        character: item.character,
        moods: item.moods,
        speed: item.speed,
      };

      if (item.type === "alternatives") {
        const alternativesLine: AlternativeLine = {
          ...baseLine,
          type: "alternatives",
          alternatives: item.alternatives,
        };
        return alternativesLine;
      }

      if (item.type === "input") {
        const inputLine: InputLine = {
          ...baseLine,
          type: "input",
          inputLabel: item.inputLabel,
        };
        return inputLine;
      }

      const dialogueLine: DialogueLine = {
        ...baseLine,
        type: "dialogue",
      };

      return dialogueLine;
    });
  });
  return interactions;
}
