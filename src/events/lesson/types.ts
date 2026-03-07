export interface LessonEntryNotebookEvent {
  ids: string[];
  phase: string;
}

export interface ToggleNotebookEvent {
  delay?: number;
}
