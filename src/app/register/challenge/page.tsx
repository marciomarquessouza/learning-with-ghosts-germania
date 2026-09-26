import { Challenge } from "@/components/Register/Challenge";
import { Language } from "@/server/lessons/schemas/language";

export default async function ChallengePage() {
  const lessonLanguages: Language[] = ["de-DE", "en-UK"];

  return <Challenge languages={lessonLanguages} />;
}
