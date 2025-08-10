import { CHARACTERS } from "@/constants/game";
import mitt from "mitt";

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type NoiseKeys = "default" | "selectable";
export type InteractionTypes =
  | "dialogue"
  | "alternatives"
  | "input"
  | "feedback";

export interface DialogueLine {
  type: "dialogue";
  text: string;
  character: CHARACTERS;
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
  lines: InteractionLine[];
  onComplete?: () => void;
}

export type Events = {
  "change-scene": {
    targetScene: string;
    fade?: boolean;
    options?: TransitionOptions;
  };
  "show-message": {
    title: string;
    text: string;
    closeAfter?: number;
  };
  "show-dialogue": DialogueEvent;
  "noise-effect": { key: NoiseKeys; position?: Position; size?: Size };
};

export const gameEvents = mitt<Events>();
