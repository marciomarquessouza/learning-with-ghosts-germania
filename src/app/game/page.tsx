import { getGamePath } from "@/components/Register/flow/registerFlow";
import { Language } from "@/server/lessons/schemas/language";
import { Level } from "@/server/lessons/schemas/level";
import { redirect } from "next/navigation";

export default async function GameRedirectPage() {
  const day = 1;
  const challengeLanguage: Language = "de-DE";
  const level: Level = "A1-1";
  const playerLanguage: Language = "en-UK";

  const gamePath = getGamePath({
    challengeLanguage,
    playerLanguage,
    level,
    day,
  });

  redirect(gamePath);
}
