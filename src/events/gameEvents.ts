import { CHARACTERS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import mitt from "mitt";
import { ReactNode } from "react";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { GAME_WORLDS, InteractionLine } from "@/types";
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
  };
  "change-world-transition": {
    afterClose?: () => void;
  };
  "change-scene": {
    targetScene: string;
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
  "krampus/damage": { amount: number };
  "krampus/speed": { speed: number };
};

export const gameEvents = mitt<Events>();
