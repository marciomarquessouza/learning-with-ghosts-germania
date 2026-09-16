import { GamePageClient } from "./GamePageClient";
import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { parseLevel } from "@/server/lessons/validators/levels";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string, level: string }>;
  searchParams: Promise<{ language?: string | string[] }>;
}) {
  const { day: dayRaw, level: levelRaw } = await params;
  const { language: languageRaw } = await searchParams;

  const language = parseLanguage(
    Array.isArray(languageRaw) ? languageRaw[0] : languageRaw,
  );
  const day = Number(dayRaw);
  const level = parseLevel(levelRaw)

  const dayContent = await getLesson({
    day,
    language,
    level
  });

  return <GamePageClient day={day} dayContent={dayContent} />;
}
