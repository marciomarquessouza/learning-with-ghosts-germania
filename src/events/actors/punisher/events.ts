import { createEventManagers } from "@/libs/events/createEventManagers";

type PunisherSyncEvents = {
  "punisher/damage": { amount: number };
  "punisher/speed": { speed: number };
  "punisher/hate": { hate: number };
  "punisher/released": { skyEffectAmount?: number; onFinish: () => void };
};

type PunisherAsyncEvents = {
  placeholder: { amount: number };
};

export const punisherEvents = createEventManagers<
  PunisherSyncEvents,
  PunisherAsyncEvents
>();
