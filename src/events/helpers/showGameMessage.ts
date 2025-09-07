import { gameEvents } from "../gameEvents";

export interface GameMessage {
  title?: string;
  text?: string;
  closeAfter?: number;
  hide?: boolean;
}

export function showGameMessage({
  title,
  text,
  closeAfter,
  hide,
}: GameMessage): Promise<void> {
  return new Promise((resolve) => {
    if (hide) {
      gameEvents.emit("hide-message", {});
    } else {
      gameEvents.emit("show-message", {
        title: title || "",
        text: text || "",
        closeAfter,
      });
    }
    return resolve();
  });
}
