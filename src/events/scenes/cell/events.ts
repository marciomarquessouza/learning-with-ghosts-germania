import { IntroductionEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type CellSyncEvents = {
  placeholder: undefined;
};

export type CellAsyncEvents = {
  "show-introduction": IntroductionEvent;
};

export const cellEvents = createEventManagers<
  CellSyncEvents,
  CellAsyncEvents
>();
