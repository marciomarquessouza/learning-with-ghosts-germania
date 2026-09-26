import { AudioManifest } from "../schemas/audio";
import {
  Lesson,
  LessonDefinition,
  LessonEntryStep,
  LessonLocale,
} from "../schemas/lesson";

interface ComposeLessonOptions {
  lesson: LessonDefinition;
  locale: LessonLocale;
  audio: AudioManifest;
}

export function composeLesson({
  lesson,
  locale,
  audio,
}: ComposeLessonOptions): Lesson {
  return {
    id: lesson.id,
    day: lesson.day,
    title: locale.title,
    limits: lesson.limits,

    entries: Object.entries(lesson.entries).map(([id, entry]) => {
      console.log("#localizedEntry", locale.entries);
      const localizedEntry = locale.entries[id];
      const audioEntry = audio[id];

      if (!localizedEntry) {
        throw new Error(`Missing locale for lesson entry: ${id}`);
      }

      if (!audioEntry) {
        throw new Error(`Missing audio for lesson entry: ${id}`);
      }

      return {
        id,
        sequence: entry.sequence,
        target: entry.target,
        reference: localizedEntry.reference,

        steps: Object.entries(localizedEntry.steps).map(([type, step]) => ({
          type,
          ...step,
        })) as LessonEntryStep[],

        audio: audioEntry.path,
      };
    }),
  };
}
