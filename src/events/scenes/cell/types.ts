import { NoiseKeys } from "@/game/scenes/cell_scene/helper/createSelectableArea";
import { Position, Size } from "@/types";

export interface IntroductionEvent {
  title: string;
  hideAfter?: number;
  afterClose?: () => void;
}

export interface NoiseEffectEvent {
  key: NoiseKeys;
  position?: Position;
  size?: Size;
}
