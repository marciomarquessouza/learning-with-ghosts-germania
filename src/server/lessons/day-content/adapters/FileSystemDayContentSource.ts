import { DayContentSource } from "../core/DayContentSource";
import { dialogues as defaultDialogues } from "../content/de-DE/A1-1/default.dialogues";
import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { ChallengeOptions, Lesson } from "@/libs/lesson/types";
import { AudioManifest } from "@/libs/audio/types";
import { LessonOptions } from "../../services/getLesson";
import { contentImporters } from "../content/contentImporters";
import { Language, Level } from "@/constants/lesson";

export class FileSystemDayContentSource implements DayContentSource {
  private async getDayImporter(
    { day, challengeLanguage, playerLanguage, level }: LessonOptions,
    contentType: string,
  ) {
    const languageContent = contentImporters[challengeLanguage];

    if (!languageContent) {
      throw new Error(
        `Challenge Language content not found - language ${challengeLanguage}`,
      );
    }

    const levelContent = languageContent[level];

    if (!levelContent) {
      throw new Error(
        `Level not found - level ${level} - language ${challengeLanguage}`,
      );
    }

    const { dayContentImporters } = await levelContent();

    const importer = dayContentImporters[day];

    if (!importer) {
      throw new Error(`${contentType} not found - day ${day}`);
    }

    return importer;
  }

  async getLesson(options: LessonOptions): Promise<Lesson> {
    const importer = await this.getDayImporter(options, "Lesson");
    const { lesson } = await importer.lesson();

    return lesson;
  }

  async getAudioManifest(options: LessonOptions): Promise<AudioManifest> {
    const importer = await this.getDayImporter(options, "Audio Manifest");
    const { default: audioManifest } = await importer.audio();

    return audioManifest;
  }

  async getDialogues(options: LessonOptions): Promise<DayDialogues> {
    const importer = await this.getDayImporter(options, "Dialogues");
    const { dialogues } = await importer.dialogues();

    return dialogues;
  }

  async getDefaultDialogues({
    level,
    day,
    challengeLanguage,
    playerLanguage,
  }: LessonOptions): Promise<DefaultDialogues> {
    return defaultDialogues;
  }

  getChallengeOptions(): ChallengeOptions {
    const lessonLanguages = Object.keys(contentImporters) as Language[];
    const lessonLevels = new Set<Level>();

    lessonLanguages.forEach((language) => {
      (Object.keys(contentImporters[language]) as Level[]).forEach((level) => {
        lessonLevels.add(level);
      });
    });

    return {
      lessonLanguages,
      lessonLevels: Array.from(lessonLevels),
      playerLanguages: [],
    };
  }
}
