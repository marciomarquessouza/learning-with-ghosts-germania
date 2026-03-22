import { events } from "@/events/events";
import { DialogueEvent } from "@/events/game/types";

export function showDialogue(
  { lines, onComplete }: DialogueEvent,
  setAlternative: (id?: string) => void = () => {},
): Promise<void> {
  return new Promise((resolve) => {
    events.game.sync.emit("dialogue/show", {
      lines,
      onAlternativeSelected: setAlternative,
      onAnswerSubmitted: () => {},
      onComplete: () => {
        onComplete?.();
        resolve();
      },
    });
  });
}
