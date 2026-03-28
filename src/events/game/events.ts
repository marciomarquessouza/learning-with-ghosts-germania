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
  "game-message/hide": { delay?: number };
  "game-action-prompt/show": GameActionPromptEvent;
  "game-action-prompt/hide": undefined;
  "game-action-prompt/action": undefined;
  "dialogue/hide": { dialogueId?: string };
  "dialogue/set-mood": { mood: MOODS; character: ACTORS };
  "hud/weight-decrease": UpdateWeightEvent;
  "hud/show-items": HUD_ITEMS[];
  "hud/hide-items": HUD_ITEMS[];
};

export type GameAsyncEvents = {
  "dialogue/show": DialogueEvent;
  "change-scene": ChangeSceneEvent;
};

export const gameEvents = createEventManagers<
  GameSyncEvents,
  GameAsyncEvents
>();
