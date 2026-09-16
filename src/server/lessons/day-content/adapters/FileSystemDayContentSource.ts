import { DayContentSource } from "../core/DayContentSource";
import { dayContentImporters } from "../content/dayContentImporters";
import { dialogues as defaultDialogues } from "../content/defaults/default.dialogues";
import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { Lesson } from "@/libs/lesson/types";
import { AudioManifest } from "@/libs/audio/types";

export class FileSystemDayContentSource implements DayContentSource {
  private getDayImporter(day: number, contentType: string) {
    const importer = dayContentImporters[day];
    if (!importer) {
      throw new Error(`${contentType} not found - day ${day}`);
    }

    return importer;
  }

  async getLesson(day: number): Promise<Lesson> {
    const importer = this.getDayImporter(day, "Lesson");
    const { lesson } = await importer.lesson();

    return lesson;
  }

  async getAudioManifest(day: number): Promise<AudioManifest> {
    const importer = this.getDayImporter(day, "Audio Manifest");
    const { default: audioManifest } = await importer.audio();

    return audioManifest;
  }

  async getDialogues(day: number): Promise<DayDialogues> {
    const importer = this.getDayImporter(day, "Dialogues");
    const { dialogues } = await importer.dialogues();

    return dialogues;
  }

  async getDefaultDialogues(): Promise<DefaultDialogues> {
    return defaultDialogues;
  }
}
