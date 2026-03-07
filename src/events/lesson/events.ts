import { LessonEntryNotebookEvent, ToggleNotebookEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type Events = {
  "toggle-notebook": ToggleNotebookEvent;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvent;
};

export const lessonEvents = createEventManagers<Events>();
