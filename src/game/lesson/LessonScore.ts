import { WritingResult } from "@/events/lesson/types";
import { PronunciationScore } from "@/libs/lesson/PronunciationAPI";
import { Lesson } from "@/libs/lesson/types";

type EntryScore = {
  pronunciation: number | undefined;
  writing: number | undefined;
};

export class LessonScore {
  private entriesScore = new Map<string, EntryScore>();

  constructor(lesson: Lesson) {
    lesson.entries.forEach((entry) => {
      this.entriesScore.set(entry.id, {
        pronunciation: undefined,
        writing: undefined,
      });
    });
  }

  public addPronunciationScore(
    entryId: string,
    pronunciationScore: PronunciationScore,
  ): boolean {
    const currentPronunciationScore = this.entriesScore.get(entryId);

    if (!currentPronunciationScore) {
      console.error("This entry id has the score empty: ", entryId);
      return false;
    }

    this.entriesScore.set(entryId, {
      ...currentPronunciationScore,
      pronunciation: pronunciationScore.accuracyPercentage,
    });

    return true;
  }

  public addWritingScore(
    entryId: string,
    writingScore: WritingResult,
  ): boolean {
    const currentWritingScore = this.entriesScore.get(entryId);

    if (!currentWritingScore) {
      console.error("This entry id has the score empty: ", entryId);
      return false;
    }

    return true;
  }
}
