import { events } from "@/events/events";
import { CharacterMood } from "@/types";

export function setCharactersMood(
  charactersMood?: CharacterMood[],
): Promise<void> {
  return new Promise((resolve) => {
    if (!charactersMood) return resolve();
    charactersMood.forEach(({ mood, character }) => {
      events.game.sync.emit("set-mood", {
        mood,
        character,
      });
    });

    return resolve();
  });
}
