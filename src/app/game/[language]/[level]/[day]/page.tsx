import { GamePageClient } from "./GamePageClient";
import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { parseLevel } from "@/server/lessons/validators/levels";

export default async function GamePage({
  params,
}: {
  params: Promise<{ language: string; day: string; level: string }>;
}) {
  const { language: languageRaw, day: dayRaw, level: levelRaw } = await params;

  const language = parseLanguage(languageRaw);
  const day = Number(dayRaw);
  const level = parseLevel(levelRaw);

  const dayContent = await getLesson({
    language,
    level,
    day,
  });

  return <GamePageClient day={day} dayContent={dayContent} />;
}

export function generateStaticParams() {
  return [
    {
      language: "de-DE",
      level: "A1-1",
      day: "1",
    },
  ];
}
