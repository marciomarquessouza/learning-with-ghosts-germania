import { GameScenes, GameWorlds } from "@/types";
import { ChangeSceneEvent, DialogueEvent, ZoomPropsEvent } from "./types";
import { ReactNode } from "react";
import { CHARACTERS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "canvas-ready": undefined;
  "change-world": {
    targetWorld: GameWorlds;
    targetScene: GameScenes;
  };
  "change-world-transition": undefined;
  "change-scene": ChangeSceneEvent;
  "show-game-message": {
    title: string;
    text: ReactNode;
    closeAfter?: number;
  };
  "hide-game-message": { delay?: number };
  "show-dialogue": DialogueEvent;
  "hide-dialogue": { dialogueId?: string };
  "set-mood": { mood: MOODS; character: CHARACTERS };
  "hud-actions-badge": { icon: ACTIONS_ICONS; count: number };
  "hud-actions-timer": {
    icon: ACTIONS_ICONS;
    timeInSeconds: number;
    onFinish: () => void;
  };
  "show-hud-items": HUD_ITEMS[];
  "hide-hud-items": HUD_ITEMS[];
  "camera-zoom-to": ZoomPropsEvent;
};

export const gameEvents = createEventManagers<Events>();
