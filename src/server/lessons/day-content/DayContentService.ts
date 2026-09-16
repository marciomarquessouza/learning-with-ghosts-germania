import { DayContent } from "@/types";
import { DayContentComposer } from "./core/DayContentComposer";
import { DayContentSource } from "./core/DayContentSource";

export class DayContentService {
  constructor(
    private source: DayContentSource,
    private composer: DayContentComposer,
  ) {}

  async getDayContent(day: number): Promise<DayContent> {
    const [lesson, dialogues, defaultDialogues, audioManifest] =
      await Promise.all([
        this.source.getLesson(day),
        this.source.getDialogues(day),
        this.source.getDefaultDialogues(),
        this.source.getAudioManifest(day),
      ]);

    return this.composer.compose({
      lesson,
      dialogues,
      defaultDialogues,
      audioManifest,
    });
  }
}
