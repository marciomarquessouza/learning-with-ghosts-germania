import { CHARACTERS } from "@/constants/game";

export interface LessonEntryNotebookEvent {
  ids: string[];
  phase: string;
}

export interface ToggleNotebookEvent {
  delay?: number;
}

export interface ShowLessonTitleEvent {
  title: string;
  day: number;
  closeAfter?: number;
}

export interface WriteLessonDescriptionEvent {
  description: string;
  skipPressContinue?: boolean;
  teacher?: CHARACTERS;
}
