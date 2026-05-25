import { TransitionOptions } from "@/game/core/SceneManager";
import { InteractionLine } from "@/libs/dialogues/types";
import { GameScenes, GameWorlds } from "@/types";
import { ReactNode } from "react";

export interface ZoomPropsEvent {
  zoom: number;
  duration?: number;
}

export interface DialogueEvent {
  lines: InteractionLine[];
  dialogueId?: string;
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

export type GameMessageShowEvent = {
  id?: string;
  title: string;
  text: ReactNode;
  closeAfter?: number;
};

export type ChangeWorldEvent = {
  targetWorld: GameWorlds;
  targetScene: GameScenes;
  showTransition?: boolean;
};

export type GameActionPromptEvent = {
  title: string;
  description: string;
  fixed?: boolean;
  durationMs?: number;
  onAction?: () => void;
  onClose?: () => void;
};

export type WorldTransitionEvent = {
  hideAfter?: number;
  afterClose?: () => void;
};
