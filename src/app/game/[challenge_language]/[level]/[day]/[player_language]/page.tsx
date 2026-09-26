import { createLanguageSchema } from "@/server/lessons/schemas/language";
import { GamePageClient } from "./GamePageClient";
import { getDayContent } from "@/server/lessons/services/getDayContent";
import { levelWithDefaultSchema } from "@/server/lessons/schemas/level";

type Params = {
  params: Promise<{
    challenge_language: string;
    level: string;
    day: string;
    player_language: string;
  }>;
};

export default async function GamePage({ params }: Params) {
  const {
    challenge_language,
    level: levelRaw,
    day: dayRaw,
    player_language,
  } = await params;

  const lessonLanguage =
    createLanguageSchema("lesson").parse(challenge_language);
  const playerLanguage = createLanguageSchema("player").parse(player_language);
  const level = levelWithDefaultSchema.parse(levelRaw);
  const day = Number(dayRaw);

  const dayContent = await getDayContent({
    lessonLanguage,
    level,
    day,
    playerLanguage,
  });

  return <GamePageClient day={day} dayContent={dayContent} />;
}
