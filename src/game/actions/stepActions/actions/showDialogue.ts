import { events } from "@/events/events";
import { DialogueEvent } from "@/events/game/types";

export function showDialogue(
  { lines, onComplete }: DialogueEvent,
  setAlternative: (id?: string) => void = () => {},
): Promise<void> {
  return events.game.async.emitAsync("dialogue/show", {
    lines,
    onAlternativeSelected: setAlternative,
    onComplete,
  });
}
