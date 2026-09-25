import { Language, Level } from "@/constants/lesson";
import { FileSystemDayContentSource } from "@/server/lessons/day-content/adapters/FileSystemDayContentSource";
import { DayContentComposer } from "@/server/lessons/day-content/core/DayContentComposer";
import { DayContentService } from "@/server/lessons/day-content/DayContentService";
import { DayContent } from "@/types";

export interface LessonOptions {
  day: number;
  challengeLanguage: Language;
  playerLanguage: Language;
  level: Level;
}

export async function getLesson(options: LessonOptions): Promise<DayContent> {
  const contentSource = new FileSystemDayContentSource();
  const contentComposer = new DayContentComposer();
  const service = new DayContentService(contentSource, contentComposer);
  const dayData = await service.getDayContent(options);
  return dayData;
}
