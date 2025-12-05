import { ThermoLevel } from "@/game/scenes/hud/hudThermometer";
import mitt from "mitt";

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type NoiseKeys = "default" | "selectable";

export type Events = {
  "hud-thermometer-to": { value: number; duration?: number };
  "hud-thermometer-level": { level: ThermoLevel; duration?: number };
  "noise-effect": { key: NoiseKeys; position?: Position; size?: Size };
};

export const cellEvents = mitt<Events>();
