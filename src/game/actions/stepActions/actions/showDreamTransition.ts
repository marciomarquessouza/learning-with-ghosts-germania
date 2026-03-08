import { events } from "@/events/events";

export function changeWorldTransition(): Promise<void> {
  return events.game.async.emitAsync("change-world-transition");
}
