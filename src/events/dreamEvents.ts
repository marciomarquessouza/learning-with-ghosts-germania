import { HUD_ITEMS } from "@/game/scenes/hud";
import mitt from "mitt";

export type Events = {
  "show-introduction": {
    lesson: string;
    hideAfter?: number;
    afterClose?: () => void;
  };
  "show-hud-items": HUD_ITEMS[];
  "hide-hud-items": HUD_ITEMS[];
};

export const dreamEvents = mitt<Events>();
