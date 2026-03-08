import { createEventManagers } from "@/libs/events/createEventManagers";

type KrampusSyncEvents = {
  "krampus/damage": { amount: number };
  "krampus/speed": { speed: number };
  "krampus/hate": { hate: number };
  "krampus/released": { skyEffectAmount?: number; onFinish: () => void };
};

type KrampusAsyncEvents = {
  placeholder: { amount: number };
};

export const krampusEvents = createEventManagers<
  KrampusSyncEvents,
  KrampusAsyncEvents
>();
