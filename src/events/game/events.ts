import { GameScenes, GameWorlds } from "@/types";
import {
  ChangeSceneEvent,
  DialogueEvent,
  UpdateWeightEvent,
  ZoomPropsEvent,
} from "./types";
import { ReactNode } from "react";
import { ACTORS, MOODS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type GameSyncEvents = {
  "canvas-ready": undefined;
  "change-world": {
    targetWorld: GameWorlds;
    targetScene: GameScenes;
  };
  "camera/zoom-to": ZoomPropsEvent;
  "game-message/show": {
    title: string;
    text: ReactNode;
    closeAfter?: number;
  };
  "game-message/hide": { delay?: number };
  "dialogue/hide": { dialogueId?: string };
  "dialogue/set-mood": { mood: MOODS; character: ACTORS };
  "hud/weight-decrease": UpdateWeightEvent;
  "hud/show-items": HUD_ITEMS[];
  "hud/hide-items": HUD_ITEMS[];
};

export type GameAsyncEvents = {
  "dialogue/show": DialogueEvent;
  "change-world-transition": undefined;
  "change-scene": ChangeSceneEvent;
  "hud/actions-timer": {
    icon: ACTIONS_ICONS;
    timeInSeconds: number;
    onFinish: () => void;
  };
  "hud/actions-badge": { icon: ACTIONS_ICONS; count: number };
};

export const gameEvents = createEventManagers<
  GameSyncEvents,
  GameAsyncEvents
>();
