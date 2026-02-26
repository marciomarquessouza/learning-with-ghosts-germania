import { dreamEventsAsync } from "../dreamEvents";

export interface ShowDreamIntroduction {
  lesson: string;
}

export function showDreamIntroduction({
  lesson,
}: ShowDreamIntroduction): Promise<void> {
  return dreamEventsAsync.emitAsync("dream/show-introduction", {
    lesson,
  });
}
