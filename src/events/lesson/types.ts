import {
  PronunciationFeedback,
  PronunciationScore,
} from "@/libs/lesson/PronunciationAPI";

export interface ToggleNotebookEvent {
  delay?: number;
}

export interface ShowLessonTitleEvent {
  title?: string;
  day?: number;
  closeAfter?: number;
}

export interface WriteLessonDescriptionEvent {
  dialogueTitle?: string;
  description: string;
  hidePressContinue?: boolean;
}

export interface VoiceIndicatorEvent {
  target?: string;
}

export interface PronunciationResultEvent {
  recordId: string;
  score: PronunciationScore;
  feedback: PronunciationFeedback;
}

export interface LoadingEvent {
  text?: string;
}

export type WritingLimits = {
  totalTips: number;
  totalErrors: number;
};

export type PronunciationLimits = {
  minimumRecordTime?: number;
  maximumRecordTime?: number;
};

export interface ShowWritingBoardEvent {
  target: string;
  limits: WritingLimits;
  onClickNext: (result: WritingResult) => void;
  onClickCancel?: () => void;
}

export type WritingResult = {
  success: boolean;
  size: number;
  errors: number;
  tips: number;
};

export type WriteLessonDialogueEvent = {
  title: string;
  content: string | string[];
};
