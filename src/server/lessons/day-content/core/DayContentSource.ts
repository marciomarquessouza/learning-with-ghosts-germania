import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { AudioManifest } from "@/libs/audio/types";
import { Lesson } from "@/libs/lesson/types";

export interface DayContentSource {
  getLesson(day: number): Promise<Lesson>;
  getDialogues(day: number): Promise<DayDialogues>;
  getDefaultDialogues(): Promise<DefaultDialogues>;
  getAudioManifest(day: number): Promise<AudioManifest>;
}
