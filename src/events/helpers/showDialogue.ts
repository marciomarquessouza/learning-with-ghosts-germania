import { DialogueEvent, gameEvents } from "@/events/gameEvents";

export function showDialogue(
  { lines, onComplete }: DialogueEvent,
  setAlternative: (id?: string) => void = () => {}
): Promise<void> {
  return new Promise((resolve) => {
    lines.forEach((line) => {
      if (line.type === "alternatives") {
        line.onSubmitted = setAlternative;
      }
    });
    gameEvents.emit("show-dialogue", {
      lines,
      onComplete: () => {
        onComplete?.();
        resolve();
      },
    });
  });
}
