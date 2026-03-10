import { events } from "@/events/events";
import { DialogueEvent } from "@/events/game/types";

export function showDialogue(
  { lines, onComplete }: DialogueEvent,
  setAlternative: (id?: string) => void = () => {},
): Promise<void> {
  return new Promise((resolve) => {
    lines.forEach((line) => {
      if (line.type === "alternatives") {
        line.onSubmitted = setAlternative;
      }
    });
    events.game.sync.emit("dialogue/show", {
      lines,
      onComplete: () => {
        onComplete?.();
        resolve();
      },
    });
  });
}
