import { createLanguageSchema } from "@/schemas/language";
import { levelWithDefaultSchema } from "@/schemas/level";
import { getDayContent } from "@/server/lessons/services/getDayContent";
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

  const lessonLanguage =
    createLanguageSchema("lesson").parse(challenge_language);
  const playerLanguage = createLanguageSchema("player").parse(player_language);
  const level = levelWithDefaultSchema.parse(levelRaw);
  const day = Number(dayRaw);

  try {
    const dayContent = await getDayContent({
      lessonLanguage,
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
