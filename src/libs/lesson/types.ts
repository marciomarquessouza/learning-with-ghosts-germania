import { AudioScoreSummary } from "../audio/types";

import { Language } from "@/schemas/language";
import { Level } from "@/schemas/level";

export type {
  Lesson,
  LessonDetails,
  LessonEntry,
  LessonEntryStep,
  LessonStepType,
  LessonChallengeLimits,
  PronunciationLimits,
  WritingLimits,
} from "@/schemas/lesson";

export type StepPhases =
  | "show"
  | "writing"
  | "pronunciation"
  | "result:analysis"
  | "result:correct"
  | "result:fail"
  | "result:feedback"
  | "hide";

export type ChallengeOptions = {
  playerLanguages: Language[];
  lessonLanguages: Language[];
  lessonLevels: Level[];
};

export type PronunciationResult = {
  type: "pronunciation";
  scoreResult: AudioScoreSummary;
};

export interface WritingScore {
  success: boolean;
  size: number;
  errors: number;
  tips: number;
}

export type WritingResult = {
  type: "writing";
  scoreResult: WritingScore;
};

export type ChallengeResult = {
  totalTime: number;
  result: PronunciationResult | WritingResult;
};

export interface StepFlags {
  stepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
}
