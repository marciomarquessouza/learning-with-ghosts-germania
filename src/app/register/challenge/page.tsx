import { Challenge } from "@/components/Register/Challenge";
import { Language } from "@/schemas/language";

export default async function ChallengePage() {
  const lessonLanguages: Language[] = ["de-DE", "en-UK"];

  return <Challenge languages={lessonLanguages} />;
}
