import { AudioManifest } from "@/libs/audio/types";
import { Lesson, LessonEntry } from "@/libs/lesson/types";

export function mergeLessonWithAudioManifest(
  lesson: Lesson,
  audioManifest?: AudioManifest,
): Lesson {
  if (!audioManifest) {
    return lesson;
  }

  const updatesEntries: LessonEntry[] = lesson.entries.map((entry) => ({
    ...entry,
    audio: audioManifest[entry.id].path || undefined,
  }));

  return {
    ...lesson,
    entries: updatesEntries,
  };
}
