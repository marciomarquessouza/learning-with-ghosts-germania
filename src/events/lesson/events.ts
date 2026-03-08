import type {
  LessonEntryNotebookEvent,
  WriteLessonDescriptionEvent,
  ShowLessonTitleEvent,
  ToggleNotebookEvent,
} from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type Events = {
  "show-header": undefined;
  "hide-header": undefined;
  "show-lesson-title": ShowLessonTitleEvent;
  "write-lesson-description": WriteLessonDescriptionEvent;
  "toggle-notebook": ToggleNotebookEvent;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvent;
};

export const lessonEvents = createEventManagers<Events>();
