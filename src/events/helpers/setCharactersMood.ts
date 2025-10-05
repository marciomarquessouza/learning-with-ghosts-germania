import { CharacterMood } from "@/types";
import { gameEvents } from "../gameEvents";

export function setCharactersMood(
  charactersMood?: CharacterMood[]
): Promise<void> {
  return new Promise((resolve) => {
    if (!charactersMood) return resolve();
    charactersMood.forEach(({ mood, character }) => {
      gameEvents.emit("set-mood", {
        mood,
        character,
      });
    });

    return resolve();
  });
}
