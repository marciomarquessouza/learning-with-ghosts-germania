import { DayContent } from "@/types";
import { DayContentComposer } from "./core/DayContentComposer";
import { DayContentSource } from "./core/DayContentSource";
import { LessonOptions } from "../services/getLesson";

export class DayContentService {
  constructor(
    private source: DayContentSource,
    private composer: DayContentComposer,
  ) {}

  async getDayContent(options: LessonOptions): Promise<DayContent> {
    const [lesson, dialogues, defaultDialogues, audioManifest] =
      await Promise.all([
        this.source.getLesson(options),
        this.source.getDialogues(options),
        this.source.getDefaultDialogues(options),
        this.source.getAudioManifest(options),
      ]);

    return this.composer.compose({
      lesson,
      dialogues,
      defaultDialogues,
      audioManifest,
    });
  }
}
