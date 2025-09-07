import { gameEvents } from "../gameEvents";

export interface DayIntroduction {
  title: string;
  hideAfter?: number;
}

export function showDayIntroduction({
  title,
  hideAfter,
}: DayIntroduction): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("show-introduction", {
      title,
      hideAfter,
      afterClose: () => resolve(),
    });
  });
}
