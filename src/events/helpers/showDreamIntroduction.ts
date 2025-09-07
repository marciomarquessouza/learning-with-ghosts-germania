import { dreamEvents } from "../dreamEvents";

export interface ShowDreamIntroduction {
  lesson: string;
}

export function showDreamIntroduction({
  lesson,
}: ShowDreamIntroduction): Promise<void> {
  return new Promise((resolve) => {
    dreamEvents.emit("show-introduction", {
      lesson,
      afterClose: () => resolve(),
    });
  });
}
