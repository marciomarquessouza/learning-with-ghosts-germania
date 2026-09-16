import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { parseLevel } from "@/server/lessons/validators/levels";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ day: string; level: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { day: dayRaw, level: levelRaw } = await params;
  const searchParams = request.nextUrl.searchParams;
  const language = parseLanguage(searchParams.get("language"));
  const level = parseLevel(levelRaw);
  const day = Number(dayRaw);

  try {
    const dayContent = await getLesson({
      day,
      language,
      level,
    });

    return Response.json(dayContent, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
