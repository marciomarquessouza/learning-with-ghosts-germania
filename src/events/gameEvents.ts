import { CHARACTERS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import mitt from "mitt";

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

export interface DialogueLine {
  type: "dialogue";
  text: string;
  character: CHARACTERS;
  mood?: MOODS;
  speed?: number;
}

export interface Alternative {
  id: string;
  text: string;
}

export interface AlternativeLine {
  type: "alternatives";
  text: string;
  character: CHARACTERS;
  mood?: MOODS;
  speed?: number;
  alternatives: Alternative[];
  onSubmitted: (alternativeId?: string) => void;
}

export interface InputLine {
  type: "input";
  text: string;
  inputLabel: React.ReactNode;
  character: CHARACTERS;
  speed?: number;
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
    text: string;
    closeAfter?: number;
  };
  "hide-game-message": { delay?: number };
  "show-dialogue": DialogueEvent;
  "hide-dialogue": { dialogueId?: string };
  "show-introduction": IntroductionEvent;
  "hud-actions-badge": { icon: ACTIONS_ICONS; count: number };
  "hud-actions-timer": {
    icon: ACTIONS_ICONS;
    timeInSeconds: number;
    onFinish: () => void;
  };
};

export const gameEvents = mitt<Events>();
