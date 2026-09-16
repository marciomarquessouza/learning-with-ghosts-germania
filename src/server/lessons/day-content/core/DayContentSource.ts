import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { AudioManifest } from "@/libs/audio/types";
import { Lesson } from "@/libs/lesson/types";
import { LessonOptions } from "../../services/getLesson";

export interface DayContentSource {
  getLesson(options: LessonOptions): Promise<Lesson>;
  getDialogues(options: LessonOptions): Promise<DayDialogues>;
  getDefaultDialogues(options: LessonOptions): Promise<DefaultDialogues>;
  getAudioManifest(options: LessonOptions): Promise<AudioManifest>;
}
