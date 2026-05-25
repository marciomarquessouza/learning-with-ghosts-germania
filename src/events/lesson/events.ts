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
  "hide-lesson-description": undefined;
  "update-lesson-description": UpdateLessonDescriptionEvent;
};

export type LessonAsyncEvents = {
  "show-lesson-title": ShowLessonTitleEvent;
  "hide-lesson-title": undefined;
  "write-lesson-description": WriteLessonDescriptionEvent;
};

export const lessonEvents = createEventManagers<
  LessonSyncEvents,
  LessonAsyncEvents
>();
