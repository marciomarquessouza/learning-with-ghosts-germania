import type {
  LessonEntryNotebookEvent,
  WriteLessonDescriptionEvent,
  ShowLessonTitleEvent,
  ToggleNotebookEvent,
} from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type LessonSyncEvents = {
  "start-lesson": undefined;
  "toggle-notebook": ToggleNotebookEvent;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvent;
  "hide-lesson-description": undefined;
};

export type LessonAsyncEvents = {
  "show-header": undefined;
  "hide-header": undefined;
  "show-lesson-title": ShowLessonTitleEvent;
  "write-lesson-description": WriteLessonDescriptionEvent;
};

export const lessonEvents = createEventManagers<
  LessonSyncEvents,
  LessonAsyncEvents
>();
