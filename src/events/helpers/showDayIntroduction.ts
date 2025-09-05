import { gameEvents } from "../gameEvents";

export function showDayIntroduction(
  title: string,
  hideAfter?: number
): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("show-introduction", {
      title,
      hideAfter,
      afterClose: () => resolve(),
    });
  });
}
