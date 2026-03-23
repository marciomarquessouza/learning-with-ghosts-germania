import { DayContent } from "@/types";
import { mergeLessonWithAudioManifest } from "../helpers/mergeLessonWithAudioManifest";
import { DayDialogues, DefaultDialogues } from "@/libs/dialogues/types";
import { AudioManifest } from "@/libs/audio/types";
import { Lesson } from "@/libs/lesson/types";

interface ComposeParams {
  lesson: Lesson;
  dialogues: DayDialogues;
  defaultDialogues: DefaultDialogues;
  audioManifest: AudioManifest;
}

export class DayContentComposer {
  compose({
    lesson,
    dialogues,
    defaultDialogues,
    audioManifest,
  }: ComposeParams): DayContent {
    return {
      lesson: mergeLessonWithAudioManifest(lesson, audioManifest),
      dialogues: {
        ...defaultDialogues,
        ...dialogues,
      },
    };
  }
}
