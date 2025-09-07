import { cellEvents } from "../cellEvents";

export function showDreamTransition(): Promise<void> {
  return new Promise((resolve) => {
    cellEvents.emit("dream-transition", {
      afterClose: () => resolve(),
    });
  });
}
