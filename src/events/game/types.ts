import { TransitionOptions } from "@/game/core/SceneManager";
import { InteractionLine } from "@/libs/dialogues/types";
import { GameScenes } from "@/types";

export interface ZoomPropsEvent {
  zoom: number;
  duration?: number;
}

export interface DialogueEvent {
  dialogueId?: string;
  lines: InteractionLine[];
  onAlternativeSelected?: (selectedAlternative: string) => void;
  onAnswerSubmitted?: (answer: string) => void;
  onComplete?: () => void;
}

export type ChangeSceneEvent = {
  targetScene: GameScenes;
  fade?: boolean;
  transition?: TransitionOptions;
};

export type UpdateWeightEvent = {
  operation: "increase" | "decrease";
  amount: number;
};
