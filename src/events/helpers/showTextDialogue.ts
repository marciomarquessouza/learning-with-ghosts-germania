import { gameEvents } from "@/events/gameEvents";
import { DialogueLine } from "@/utils/dialogueExpressions";

export function showTextDialogue(dialogues: DialogueLine[]): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("show-dialogue", {
      lines: dialogues.map((dialogue) => ({
        type: "dialogue",
        character: dialogue.character,
        text: dialogue.text,
      })),
      onComplete: () => resolve(),
    });
  });
}
