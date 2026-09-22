import { Level } from "@/constants/lesson";
import { redirect } from "next/navigation";

export default async function GameRedirectPage() {
  const day = 1;
  const level: Level = "A1-1";
  redirect(`/game/${level}/${day}`);
}
