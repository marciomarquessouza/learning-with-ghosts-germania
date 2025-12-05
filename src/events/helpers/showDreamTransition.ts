import { gameEvents } from "../gameEvents";

export function changeWorldTransition(): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("change-world-transition", {
      afterClose: () => resolve(),
    });
  });
}
