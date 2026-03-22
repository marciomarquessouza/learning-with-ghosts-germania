import { AudioManifest, InteractionLine, Lesson } from "@/types";

export interface DayContentSource {
  getLesson(day: number): Promise<Lesson>;
  getDialogues(day: number): Promise<Record<string, InteractionLine[]>>;
  getDefaultDialogues(): Promise<Record<string, InteractionLine[]>>;
  getAudioManifest(day: number): Promise<AudioManifest>;
}
