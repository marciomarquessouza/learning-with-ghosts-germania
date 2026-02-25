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

export interface CrackEvent {
  animation: "open" | "close";
}

export interface SowingEvent {
  onFinish: () => void;
}

export interface DropSeedEvent {
  onFinish: () => void;
}

export type Events = {
  "toggle-notebook": ToggleNotebookEvents;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvents;
  "show-lesson": LessonEvent;
  "hide-lesson": { lessonId: string };
  "eliza/lesson:sowing": SowingEvent;
  "pumpkin-kid/lesson:drop-seed": DropSeedEvent;
  "pumpkin-kid/lesson:crack-ground": CrackEvent;
};

export const lessonEvents = mitt<Events>();
