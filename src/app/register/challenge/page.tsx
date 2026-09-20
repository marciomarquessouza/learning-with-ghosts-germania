import { Challenge } from "@/components/Register/Challenge";
import { getRegisterOptions } from "@/server/lessons/services/getRegisterOptions";

export default async function ChallengePage() {
  const { lessonLanguages } = getRegisterOptions();

  return <Challenge languages={lessonLanguages} />;
}
