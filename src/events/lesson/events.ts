import type {
  LessonEntryNotebookEvent,
  WriteLessonDescriptionEvent,
  ShowLessonTitleEvent,
  ToggleNotebookEvent,
  PronunciationResultEvent,
} from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type LessonSyncEvents = {
  "start-lesson": undefined;
  "toggle-notebook": ToggleNotebookEvent;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvent;
  "show-description": undefined;
  "show-voice-indicator": undefined;
  "hide-voice-indicator": undefined;
  "show-pronunciation-score": PronunciationResultEvent;
  "hide-pronunciation-score": undefined;
  "show-loading": undefined;
  "hide-loading": undefined;
};

export type LessonAsyncEvents = {
  "show-lesson-header": ShowLessonTitleEvent;
  "hide-lesson-header": undefined;
  "write-lesson-description": WriteLessonDescriptionEvent;
  "hide-lesson-description": undefined;
};

export const lessonEvents = createEventManagers<
  LessonSyncEvents,
  LessonAsyncEvents
>();
