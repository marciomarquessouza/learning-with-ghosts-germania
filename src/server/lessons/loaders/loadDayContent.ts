import { LessonOptions } from "@/server/types";
import { contentImporters } from "../generated/contentImporters";
import { AudioManifestSchema } from "@/schemas/audio";
import { LessonDefinitionSchema } from "@/schemas/lesson";
import { LocalesSchema } from "@/schemas/locales";

export async function loadDayContent({
  lessonLanguage,
  playerLanguage,
  level,
  day,
}: LessonOptions) {
  const importers = contentImporters[lessonLanguage]?.[level]?.[day];

  if (!importers) {
    throw new Error(
      `Lesson content not found: ${lessonLanguage}/${level}/${day}`,
    );
  }

  const localeImporter = importers.locales[playerLanguage];

  if (!localeImporter) {
    throw new Error(`Locale not found: ${playerLanguage}`);
  }

  const [lessonModule, audioModule, localeModule] = await Promise.all([
    importers.lesson(),
    importers.audio(),
    localeImporter(),
  ]);

  const lesson = LessonDefinitionSchema.parse(lessonModule.default);

  const locales = LocalesSchema.parse(localeModule.default);

  const audio = AudioManifestSchema.parse(audioModule.default);

  return {
    lesson,
    lessonLocale: locales.lesson,
    dialogues: locales.dialogues,
    audio,
  };
}
