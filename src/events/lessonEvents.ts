import { ChallengePhase } from "@/types";
import mitt from "mitt";

export interface ChallengeNotebookEvents {
  ids: string[];
  phase: ChallengePhase;
}

export interface ToggleNotebookEvents {
  delay?: number;
}

export type Events = {
  "toggle-notebook": ToggleNotebookEvents;
  "challenge-notebook-phase": ChallengeNotebookEvents;
  "show-lesson": undefined;
};

export const lessonEvents = mitt<Events>();
