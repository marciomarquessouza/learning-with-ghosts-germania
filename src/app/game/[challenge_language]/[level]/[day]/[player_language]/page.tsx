import { GamePageClient } from "./GamePageClient";
import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { parseLevel } from "@/server/lessons/validators/levels";

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

  const challengeLanguage = parseLanguage(challenge_language);
  const playerLanguage = parseLanguage(player_language);
  const level = parseLevel(levelRaw);
  const day = Number(dayRaw);

  const dayContent = await getLesson({
    challengeLanguage,
    level,
    day,
    playerLanguage,
  });

  return <GamePageClient day={day} dayContent={dayContent} />;
}
