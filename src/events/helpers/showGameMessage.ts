import { gameEvents } from "../gameEvents";

export function showGameMessage(
  title: string,
  text: string,
  closeAfter?: number
): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("show-message", {
      title,
      text,
      closeAfter,
    });
    return resolve();
  });
}
