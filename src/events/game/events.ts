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
  "change-world/start": ChangeWorldEvent;
  "change-world/end": undefined;
  "camera/zoom-to": ZoomPropsEvent;
  "game-message/show": GameMessageShowEvent;
  "game-message/hide": { id?: string } | undefined;
  "game-action-prompt/hide": undefined;
  "dialogue/hide": undefined;
  "dialogue/typing-start": { actor?: ACTORS | null };
  "dialogue/typing-end": undefined;
  "dialogue/set-mood": { mood: MOODS; actor: ACTORS };
  "hud/weight-decrease": UpdateWeightEvent;
  "hud/show-items": HUD_ITEMS[];
  "hud/hide-items": HUD_ITEMS[];
};

export type GameAsyncEvents = {
  "game-action-prompt/show": GameActionPromptEvent;
  "dialogue/show": DialogueEvent;
  "change-scene": ChangeSceneEvent;
  "transition/cell-dream": undefined;
};

export const gameEvents = createEventManagers<
  GameSyncEvents,
  GameAsyncEvents
>();
