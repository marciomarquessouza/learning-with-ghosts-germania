import mitt from "mitt";

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type NoiseKeys = "default" | "desk" | "bed";

export type Events = {
  "change-scene": {
    targetScene: string;
    fade?: boolean;
    options?: TransitionOptions;
  };
  "noise-effect": NoiseKeys;
};

export const gameEvents = mitt<Events>();
