export const GUARDIAN_STATES = {
  INITIAL: "GUARDIAN_INITIAL",
  IDLE: "GUARDIAN_IDLE",
  SPEAKING: "GUARDIAN_SPEAKING",
} as const;

export type GuardianStateNames =
  (typeof GUARDIAN_STATES)[keyof typeof GUARDIAN_STATES];
