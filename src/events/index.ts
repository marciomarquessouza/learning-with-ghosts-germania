import { CHARACTERS } from "@/constants/game";
import mitt from "mitt";

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type NoiseKeys = "default" | "selectable";

export interface DialogueLine {
  text: string;
  character: CHARACTERS;
  speed?: number;
}

export interface DialogueEvent {
  lines: DialogueLine[];
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
