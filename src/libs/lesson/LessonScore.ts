import { DEFAULT_TOTAL_ERRORS, DEFAULT_TOTAL_TIPS } from "@/constants/game";
import { events } from "@/events/events";
import { WritingResult } from "@/events/lesson/types";
import { PronunciationScore } from "@/libs/lesson/PronunciationAPI";
import { Lesson, LessonChallengeLimits } from "@/libs/lesson/types";
import { useLessonStore } from "@/store/lessonStore";
import { getRequired } from "@/utils/getRequired";

export type EntryScore = {
  pronunciation?: number;
  writing?: number;
  listening?: number;
  grammar?: number;
};

const WRITING_ERROR_WEIGHT = 0.4;
const WRITING_TIP_WEIGHT = 0.6;

export class LessonScore {
  private readonly entriesScore = new Map<string, EntryScore>();
  private readonly limits: Required<LessonChallengeLimits["writing"]>;

  private _lesson?: Lesson;

  constructor(lesson: Lesson) {
    const { entries, limits } = lesson;
    this._lesson = lesson;

    this.limits = {
      totalTips: limits?.writing?.totalTips ?? DEFAULT_TOTAL_TIPS,
      totalErrors: limits?.writing?.totalErrors ?? DEFAULT_TOTAL_ERRORS,
    };

    for (const entry of entries) {
      this.entriesScore.set(entry.id, {});
    }
  }

  private get lesson(): Lesson {
    return getRequired(this._lesson, "LessonScore", "lesson");
  }

  public updateEntryScore(entryId: string, score: EntryScore): void {
    this.entriesScore.set(entryId, score);
    useLessonStore.getState().setScore(entryId, score);
    events.lesson.sync.emit("update-lesson-score", {
      lessonId: this.lesson.id,
      entryId,
      score,
    });
  }

  public getEntryScore(entryId: string): EntryScore | undefined {
    return this.entriesScore.get(entryId);
  }

  public getAllScores(): Record<string, EntryScore> {
    return Object.fromEntries(this.entriesScore);
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

    this.updateEntryScore(entryId, {
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

    this.updateEntryScore(entryId, {
      ...current,
      writing: Number(finalScore.toFixed(2)),
    });

    return true;
  }
}
