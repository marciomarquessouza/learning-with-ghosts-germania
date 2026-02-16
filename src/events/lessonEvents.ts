import { Lesson } from "@/types";
import mitt from "mitt";

export interface LessonEvent {
  lesson: Lesson;
  onComplete?: () => void;
}

export interface LessonEntryNotebookEvents {
  ids: string[];
  phase: string;
}

export interface ToggleNotebookEvents {
  delay?: number;
}

export interface OpenCrackEvent {
  animation: "open" | "close";
}

export type Events = {
  "toggle-notebook": ToggleNotebookEvents;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvents;
  "show-lesson": LessonEvent;
  "hide-lesson": { lessonId: string };
  "pumpkin-kid/crack-ground": OpenCrackEvent;
};

export const lessonEvents = mitt<Events>();
