import { DreamShowIntroductionEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type DreamSyncEvents = {
  placeholder: undefined;
};

export type DreamAsyncEvents = {
  "dream/show-introduction": DreamShowIntroductionEvent;
};

export const dreamEvents = createEventManagers<
  DreamSyncEvents,
  DreamAsyncEvents
>();
