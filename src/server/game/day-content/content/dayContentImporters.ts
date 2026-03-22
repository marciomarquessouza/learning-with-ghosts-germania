import { AudioManifest, InteractionLine, Lesson } from "@/types";

export const dayContentImporters: Record<
  number,
  {
    lesson: () => Promise<{ lesson: Lesson }>;
    dialogues: () => Promise<{
      dialogues: Record<string, () => InteractionLine[]>;
    }>;
    audio: () => Promise<{ default: AudioManifest }>;
  }
> = {
  1: {
    lesson: () => import("../content/days/day_01/day_01.lesson"),
    dialogues: () => import("../content/days/day_01/day_01.dialogues"),
    audio: () => import("../content/days/day_01/day_01.audio.json"),
  },
};
