// src/app/game/[day]/page.tsx
import { FileSystemDayContentSource } from "@/server/game/day-content/adapters/FileSystemDayContentSource";
import { DayContentComposer } from "@/server/game/day-content/core/DayContentComposer";
import { DayContentService } from "@/server/game/day-content/DayContentService";
import { GamePageClient } from "./GamePageClient";

export default async function GamePage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;

  const service = new DayContentService(
    new FileSystemDayContentSource(),
    new DayContentComposer(),
  );

  const dayNumber = Number(day);
  const dayContent = await service.getDayContent(dayNumber);

  return <GamePageClient day={dayNumber} dayContent={dayContent} />;
}
