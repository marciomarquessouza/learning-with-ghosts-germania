import {
  PronunciationFeedback,
  PronunciationScore,
} from "@/libs/lesson/PronunciationAPI";

export interface LessonEntryNotebookEvent {
  ids: string[];
  phase: string;
}

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

export interface PronunciationResultEvent {
  recordId: string;
  score: PronunciationScore;
  feedback: PronunciationFeedback;
}
