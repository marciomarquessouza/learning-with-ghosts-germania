import { TransitionOptions } from "@/game/core/SceneManager";
import { GameScenes, InteractionLine } from "@/types";

export interface ZoomPropsEvent {
  zoom: number;
  duration?: number;
}

export interface DialogueEvent {
  dialogueId?: string;
  lines: InteractionLine[];
  onComplete?: () => void;
}

export type ChangeSceneEvent = {
  targetScene: GameScenes;
  fade?: boolean;
  transition?: TransitionOptions;
};
