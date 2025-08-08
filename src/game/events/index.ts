import mitt from "mitt";

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type NoiseKeys = "default" | "selectable";

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
  "noise-effect": { key: NoiseKeys; position?: Position; size?: Size };
};

export const gameEvents = mitt<Events>();
