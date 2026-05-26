import type {
  LessonEntryNotebookEvent,
  WriteLessonDescriptionEvent,
  ShowLessonTitleEvent,
  ToggleNotebookEvent,
  UpdateLessonDescriptionEvent,
} from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type LessonSyncEvents = {
  "start-lesson": undefined;
  "toggle-notebook": ToggleNotebookEvent;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvent;
  "update-lesson-description": UpdateLessonDescriptionEvent;
  "show-voice-indicator": undefined;
  "hide-voice-indicator": undefined;
};

export type LessonAsyncEvents = {
  "show-lesson-title": ShowLessonTitleEvent;
  "hide-lesson-title": undefined;
  "write-lesson-description": WriteLessonDescriptionEvent;
  "hide-lesson-description": undefined;
};

export const lessonEvents = createEventManagers<
  LessonSyncEvents,
  LessonAsyncEvents
>();
