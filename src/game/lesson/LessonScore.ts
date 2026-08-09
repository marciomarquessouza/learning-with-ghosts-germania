import { DEFAULT_TOTAL_ERRORS, DEFAULT_TOTAL_TIPS } from "@/constants/game";
import { WritingResult } from "@/events/lesson/types";
import { PronunciationScore } from "@/libs/lesson/PronunciationAPI";
import { Lesson, LessonChallengeLimits } from "@/libs/lesson/types";

type EntryScore = {
  pronunciation?: number;
  writing?: number;
};

const WRITING_ERROR_WEIGHT = 0.4;
const WRITING_TIP_WEIGHT = 0.6;

export class LessonScore {
  private readonly entriesScore = new Map<string, EntryScore>();
  private readonly limits: Required<LessonChallengeLimits["writing"]>;

  constructor(lesson: Lesson) {
    const { entries, limits } = lesson;

    this.limits = {
      totalTips: limits?.writing?.totalTips ?? DEFAULT_TOTAL_TIPS,
      totalErrors: limits?.writing?.totalErrors ?? DEFAULT_TOTAL_ERRORS,
    };

    for (const entry of entries) {
      this.entriesScore.set(entry.id, {});
    }
  }

  public getEntryScore(entryId: string): EntryScore | undefined {
    return this.entriesScore.get(entryId);
  }

  public getAllScores(): ReadonlyMap<string, EntryScore> {
    return this.entriesScore;
  }

  public addPronunciationScore(
    entryId: string,
    pronunciationScore: PronunciationScore,
  ): boolean {
    const current = this.entriesScore.get(entryId);

    if (!current) {
      console.error(`[LessonScore] Entry not found: ${entryId}`);
      return false;
    }

    this.entriesScore.set(entryId, {
      ...current,
      pronunciation: pronunciationScore.accuracyPercentage,
    });

    return true;
  }

  public addWritingScore(
    entryId: string,
    writingScore: WritingResult,
  ): boolean {
    const current = this.entriesScore.get(entryId);

    if (!current) {
      console.error(`[LessonScore] Entry not found: ${entryId}`);
      return false;
    }

    const errorPenalty =
      (writingScore.errors /
        (this.limits?.totalErrors ?? DEFAULT_TOTAL_ERRORS)) *
      WRITING_ERROR_WEIGHT;

    const tipPenalty =
      (writingScore.tips / (this.limits?.totalTips ?? DEFAULT_TOTAL_TIPS)) *
      WRITING_TIP_WEIGHT;

    const finalScore = Math.max(0, 1 - errorPenalty - tipPenalty) * 100;

    this.entriesScore.set(entryId, {
      ...current,
      writing: Number(finalScore.toFixed(2)),
    });

    return true;
  }
}
