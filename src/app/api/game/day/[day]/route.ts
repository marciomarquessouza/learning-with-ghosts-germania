import { FileSystemDayContentSource } from "@/server/game/day-content/adapters/FileSystemDayContentSource";
import { DayContentComposer } from "@/server/game/day-content/core/DayContentComposer";
import { DayContentService } from "@/server/game/day-content/DayContentService";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ day: string }> },
) {
  const { day } = await params;
  const contentSource = new FileSystemDayContentSource();
  const contentComposer = new DayContentComposer();
  const service = new DayContentService(contentSource, contentComposer);
  const dayData = await service.getDayContent(Number(day));

  return Response.json(dayData);
}
