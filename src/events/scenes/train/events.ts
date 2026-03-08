import { createEventManagers } from "@/libs/events/createEventManagers";
import { ChallengeCommand } from "@/types";

export type TrainSyncEvents = {
  "train/controls:show": undefined;
  "train/speed": { speed: number };
  "train/coal:add": { amount: number };
  "train/pressure": { pressure: number };
  "train/attack:availability": { enabled: boolean; gap?: number };
  "train/attack:arrow": { power: number };
  "train/challenge": { command: ChallengeCommand };
};

export type TrainAsyncEvents = {
  placeholder: undefined;
};

export const trainEvents = createEventManagers<
  TrainSyncEvents,
  TrainAsyncEvents
>();
