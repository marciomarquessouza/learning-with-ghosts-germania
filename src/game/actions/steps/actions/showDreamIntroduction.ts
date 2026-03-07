import { events } from "@/events/events";

export interface ShowDreamIntroduction {
  lesson: string;
}

export function showDreamIntroduction({
  lesson,
}: ShowDreamIntroduction): Promise<void> {
  return events.scenes.dream.async.emitAsync("dream/show-introduction", {
    lesson,
  });
}
