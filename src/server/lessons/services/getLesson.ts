import { FileSystemDayContentSource } from "@/server/game/day-content/adapters/FileSystemDayContentSource";
import { DayContentComposer } from "@/server/game/day-content/core/DayContentComposer";
import { DayContentService } from "@/server/game/day-content/DayContentService";
import { DayContent } from "@/types";

export async function getLesson(
  day: number,
  language: string,
): Promise<DayContent> {
  const contentSource = new FileSystemDayContentSource();
  const contentComposer = new DayContentComposer();
  const service = new DayContentService(contentSource, contentComposer);
  const dayData = await service.getDayContent(Number(day));
  return dayData;
}
