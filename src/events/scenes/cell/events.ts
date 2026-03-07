import { IntroductionEvent, NoiseEffectEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type Events = {
  "show-introduction": IntroductionEvent;
  "noise-effect": NoiseEffectEvent;
};

export const cellEvents = createEventManagers<Events>();
