import { ChallengePhase } from "@/types";
import mitt from "mitt";

export interface ChallengeNotebookEvents {
  ids: string[];
  phase: ChallengePhase;
}

export type Events = {
  "challenge-notebook-phase": ChallengeNotebookEvents;
};

export const lessonEvents = mitt<Events>();
