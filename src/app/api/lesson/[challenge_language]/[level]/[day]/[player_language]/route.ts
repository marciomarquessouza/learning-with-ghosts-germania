import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { parseLevel } from "@/server/lessons/validators/levels";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    challenge_language: string;
    level: string;
    day: string;
    player_language: string;
  }>;
};

export async function GET(_: NextRequest, { params }: Params) {
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

  try {
    const dayContent = await getLesson({
      challengeLanguage,
      level,
      day,
      playerLanguage,
    });

    return Response.json(dayContent, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
