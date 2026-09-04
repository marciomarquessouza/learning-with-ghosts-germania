export const GUARDIAN_STATES = {
  IDLE: "GUARDIAN_IDLE",
  LEAN_IDLE: "GUARDIAN_LEAN_IDLE",
  LEAN_SPEAKING: "GUARDIAN_LEAN_SPEAKING",
} as const;

export type GuardianStateNames =
  (typeof GUARDIAN_STATES)[keyof typeof GUARDIAN_STATES];
