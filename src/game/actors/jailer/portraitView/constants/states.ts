export const JAILER_STATES = {
  IDLE: "JAILER_IDLE",
} as const;

export type JailerStateNames =
  (typeof JAILER_STATES)[keyof typeof JAILER_STATES];
