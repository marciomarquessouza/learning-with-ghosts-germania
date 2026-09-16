import { FileSystemDayContentSource } from "@/server/lessons/day-content/adapters/FileSystemDayContentSource";
import { DayContentComposer } from "@/server/lessons/day-content/core/DayContentComposer";
import { DayContentService } from "@/server/lessons/day-content/DayContentService";
import { DayContent } from "@/types";
import { Level } from "../validators/levels";
import { Language } from "../validators/language";

export interface LessonOptions {
  day: number;
  language: Language;
  level: Level;
}

export async function getLesson(options: LessonOptions): Promise<DayContent> {
  const contentSource = new FileSystemDayContentSource();
  const contentComposer = new DayContentComposer();
  const service = new DayContentService(contentSource, contentComposer);
  const dayData = await service.getDayContent(options);
  return dayData;
}
