import type {
  ChangeSceneEvent,
  ChangeWorldEvent,
  DialogueEvent,
  GameActionPromptEvent,
  GameMessageShowEvent,
  UpdateWeightEvent,
  ZoomPropsEvent,
} from "./types";
import { ACTORS, MOODS } from "@/constants/game";
import { HUD_ITEMS } from "@/game/hud";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type GameSyncEvents = {
  "canvas-ready": undefined;
  "change-world": ChangeWorldEvent;
  "camera/zoom-to": ZoomPropsEvent;
  "game-message/show": GameMessageShowEvent;
  "game-message/hide": undefined;
  "game-action-prompt/hide": undefined;
  "dialogue/hide": undefined;
  "dialogue/set-mood": { mood: MOODS; character: ACTORS };
  "hud/weight-decrease": UpdateWeightEvent;
  "hud/show-items": HUD_ITEMS[];
  "hud/hide-items": HUD_ITEMS[];
  "close-all-ui-interactions": undefined;
};

export type GameAsyncEvents = {
  "game-action-prompt/show": GameActionPromptEvent;
  "dialogue/show": DialogueEvent;
  "change-scene": ChangeSceneEvent;
};

export const gameEvents = createEventManagers<
  GameSyncEvents,
  GameAsyncEvents
>();
