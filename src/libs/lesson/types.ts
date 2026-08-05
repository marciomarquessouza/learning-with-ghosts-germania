import { WritingLimits } from "@/events/lesson/types";
import { AudioScoreSummary } from "../audio/types";

export type LessonStepType =
  | "introduction"
  | "listening"
  | "pronunciation"
  | "writing";

export type StepPhases =
  | "show"
  | "writing"
  | "pronunciation"
  | "result:analysis"
  | "result:correct"
  | "result:fail"
  | "result:feedback"
  | "hide";

export type LessonEntryStep = {
  type: LessonStepType;
  text: string;
  instruction: string;
  meanings?: string[];
  gender?: string;
};

export type LessonEntry = {
  id: string;
  reference: string;
  target: string;
  sequence: number;
  audio?: string;
  steps: LessonEntryStep[];
};

export type Lesson = {
  id: string;
  day: number;
  title: string;
  limits?: WritingLimits;
  entries: LessonEntry[];
};

export type LessonDetails = Omit<Lesson, "entries">;

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
