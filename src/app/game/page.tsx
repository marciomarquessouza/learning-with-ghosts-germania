import { redirect } from "next/navigation";

export default async function GameRedirectPage() {
  const day = 1; // TODO: get the real day fro muser progress
  redirect(`/game/${day}`);
}
