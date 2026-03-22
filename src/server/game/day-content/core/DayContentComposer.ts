import { AudioManifest, DayContent, InteractionLine, Lesson } from "@/types";
import { mergeLessonWithAudioManifest } from "../helpers/mergeLessonWithAudioManifest";

interface ComposeParams {
  lesson: Lesson;
  dialogues: Record<string, InteractionLine[]>;
  defaultDialogues: Record<string, InteractionLine[]>;
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
