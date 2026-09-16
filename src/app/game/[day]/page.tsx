import { GamePageClient } from "./GamePageClient";
import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ language?: string | string[] }>;
}) {
  const { day } = await params;
  const { language: languageRaw } = await searchParams;

  const language = parseLanguage(
    Array.isArray(languageRaw) ? languageRaw[0] : languageRaw,
  );
  const dayNumber = Number(day);

  const dayContent = await getLesson(dayNumber, language);

  return <GamePageClient day={dayNumber} dayContent={dayContent} />;
}
