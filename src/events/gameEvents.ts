import { CHARACTERS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import mitt from "mitt";
import { ReactNode } from "react";
import { HUD_ITEMS } from "@/game/scenes/hud";
import {
  ChallengeCommand,
  GAME_WORLDS,
  GameScenes,
  InteractionLine,
} from "@/types";
import { TransitionOptions } from "./cellEvents";

export interface DialogueEvent {
  dialogueId?: string;
  lines: InteractionLine[];
  onComplete?: () => void;
}

export interface IntroductionEvent {
  title: string;
  hideAfter?: number;
  afterClose?: () => void;
}

export interface ZoomProps {
  zoom: number;
  duration?: number;
}

export type Events = {
  "canvas-ready": undefined;
  "change-world": {
    targetWorld: GAME_WORLDS;
    targetScene: GameScenes;
  };
  "change-world-transition": {
    afterClose?: () => void;
  };
  "change-scene": {
    targetScene: GameScenes;
    fade?: boolean;
    options?: TransitionOptions;
  };
  "show-game-message": {
    title: string;
    text: ReactNode;
    closeAfter?: number;
  };
  "hide-game-message": { delay?: number };
  "show-dialogue": DialogueEvent;
  "hide-dialogue": { dialogueId?: string };
  "set-mood": { mood: MOODS; character: CHARACTERS };
  "show-introduction": IntroductionEvent;
  "hud-actions-badge": { icon: ACTIONS_ICONS; count: number };
  "hud-actions-timer": {
    icon: ACTIONS_ICONS;
    timeInSeconds: number;
    onFinish: () => void;
  };
  "show-hud-items": HUD_ITEMS[];
  "hide-hud-items": HUD_ITEMS[];
  "camera-zoom-to": ZoomProps;
  "train/controls:show": undefined;
  "train/speed": { speed: number };
  "train/coal:add": { amount: number };
  "train/pressure": { pressure: number };
  "train/attack:availability": { enabled: boolean; gap?: number };
  "train/attack:arrow": { power: number };
  "train/challenge": { command: ChallengeCommand };
  "krampus/damage": { amount: number };
  "krampus/speed": { speed: number };
  "krampus/hate": { hate: number };
};

export const gameEvents = mitt<Events>();
