import { events } from "@/events/events";

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
      events.game.sync.emit("game-message/hide", {});
    } else {
      events.game.sync.emit("game-message/show", {
        title: title || "",
        text: text || "",
        closeAfter,
      });
    }
    return resolve();
  });
}
