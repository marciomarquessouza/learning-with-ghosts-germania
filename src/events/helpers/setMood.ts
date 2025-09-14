import { MOODS } from "@/constants/game";
import { gameEvents } from "../gameEvents";

export function setMood(mood?: MOODS): Promise<void> {
  return new Promise((resolve) => {
    if (!mood) return resolve();
    gameEvents.emit("set-mood", {
      mood,
    });
    return resolve();
  });
}
