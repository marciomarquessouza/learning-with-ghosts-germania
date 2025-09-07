import { DialogueEvent, gameEvents } from "@/events/gameEvents";

export function showTextDialogue({
  lines,
  onComplete,
}: DialogueEvent): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("show-dialogue", {
      lines,
      onComplete: () => {
        onComplete?.();
        resolve();
      },
    });
  });
}
