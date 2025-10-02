import { CHARACTERS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import mitt from "mitt";
import { ReactNode } from "react";
import { HUD_ITEMS } from "@/game/scenes/hud";

export enum GAME_WORLDS {
  REAL = "REAL",
  DREAM = "DREAM",
}

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type InteractionTypes =
  | "dialogue"
  | "alternatives"
  | "input"
  | "feedback";

export interface Alternative {
  id: string;
  text: string;
}

export type CharacterMood = {
  character: CHARACTERS;
  mood: MOODS;
};

export interface BaseLine {
  text: string;
  character: CHARACTERS;
  moods?: CharacterMood[];
  speed?: number;
}

export interface DialogueLine extends BaseLine {
  type: "dialogue";
}

export interface AlternativeLine extends BaseLine {
  type: "alternatives";
  alternatives: Alternative[];
  onSubmitted: (alternativeId?: string) => void;
}

export interface InputLine extends BaseLine {
  type: "input";
  inputLabel: React.ReactNode;
  onSubmitted: (answer: string) => void;
}

export type InteractionLine = DialogueLine | AlternativeLine | InputLine;

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
  "change-world": {
    targetWorld: GAME_WORLDS;
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
};

export const gameEvents = mitt<Events>();
