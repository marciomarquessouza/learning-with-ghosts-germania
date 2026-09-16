import { DayContentSource } from "../core/DayContentSource";
import { dialogues as defaultDialogues } from "../content/de-DE/A1-1/default.dialogues";
import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { Lesson } from "@/libs/lesson/types";
import { AudioManifest } from "@/libs/audio/types";
import { LessonOptions } from "../../services/getLesson";
import { contentImporters } from "../content/contentImporters";

export class FileSystemDayContentSource implements DayContentSource {
  private async getDayImporter(
    { day, language, level }: LessonOptions,
    contentType: string,
  ) {
    const languageContent = contentImporters[language];

    if (!languageContent) {
      throw new Error(`Language content not found - language ${language}`);
    }

    const levelContent = languageContent[level];

    if (!levelContent) {
      throw new Error(
        `Level not found - level ${level} - language ${language}`,
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
    language,
  }: LessonOptions): Promise<DefaultDialogues> {
    return defaultDialogues;
  }
}
