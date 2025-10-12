import { LessonEntryPhase, Lesson } from "@/types";
import mitt from "mitt";

export interface LessonEvent {
  lesson: Lesson;
  onComplete?: () => void;
}

export interface LessonEntryNotebookEvents {
  ids: string[];
  phase: LessonEntryPhase;
}

export interface ToggleNotebookEvents {
  delay?: number;
}

export interface LessonIntroductionProps {
  onVisible?: () => void;
}

export type Events = {
  "show-lesson-introduction": LessonIntroductionProps;
  "toggle-notebook": ToggleNotebookEvents;
  "lesson-entry-notebook-phase": LessonEntryNotebookEvents;
  "show-lesson": LessonEvent;
  "hide-lesson": { lessonId: string };
};

export const lessonEvents = mitt<Events>();
