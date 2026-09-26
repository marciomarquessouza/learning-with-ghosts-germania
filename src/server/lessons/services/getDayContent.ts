import { DayContent, LessonOptions } from "@/server/types";
import { loadDayContent } from "../loaders/loadDayContent";
import { composeLesson } from "../helpers/composeLesson";
import { Dialogues } from "../schemas/dialogues";

export async function getDayContent(
  options: LessonOptions,
): Promise<DayContent> {
  const content = await loadDayContent(options);
  const lesson = composeLesson({
    lesson: content.lesson,
    locale: content.lessonLocale,
    audio: content.audio,
  });

  return {
    lesson,
    dialogues: content.dialogues as Dialogues,
  };
}
