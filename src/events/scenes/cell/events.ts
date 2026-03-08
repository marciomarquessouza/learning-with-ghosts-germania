import { IntroductionEvent, NoiseEffectEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type CellSyncEvents = {
  "noise-effect": NoiseEffectEvent;
};

export type CellAsyncEvents = {
  "show-introduction": IntroductionEvent;
};

export const cellEvents = createEventManagers<
  CellSyncEvents,
  CellAsyncEvents
>();
