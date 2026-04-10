import { createEventManagers } from "@/libs/events/createEventManagers";
import { InteractionEvent } from "./types";

export type InteractionsSyncEvents = {
  "interaction/accept": InteractionEvent;
  "interaction/cancel": InteractionEvent;
};

export type InteractionsAsyncEvents = {
  placeholder: undefined;
};

export const interactionsEvents = createEventManagers<
  InteractionsSyncEvents,
  InteractionsAsyncEvents
>();

export type InteractionKeys = keyof InteractionsSyncEvents;
