import { getLesson } from "@/server/lessons/services/getLesson";
import { parseLanguage } from "@/server/lessons/validators/language";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ day: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { day } = await params;
  const searchParams = request.nextUrl.searchParams;
  const language = parseLanguage(searchParams.get("language"));
  const dayContent = await getLesson(Number(day), language);

  return Response.json(dayContent);
}
