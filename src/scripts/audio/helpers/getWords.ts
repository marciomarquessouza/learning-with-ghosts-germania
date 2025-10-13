import { Lesson } from "@/types";
import { padDay } from "@/utils/padDay";

export async function getEntries(rawDay: number | string) {
  const day = padDay(rawDay);
  const dayLesson = `@/game/actions/actionOverridesPerDay/day_${day}/day_${day}.lesson`;

  try {
    const response = await import(dayLesson);
    const lesson: Lesson = response.lesson;
    const targets = lesson?.entries?.map((entry) => ({
      id: entry.id,
      target: entry.target,
    }));
    return targets;
  } catch (error: unknown) {
    throw error;
  }
}
