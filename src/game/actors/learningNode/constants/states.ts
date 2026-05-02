/**
 * sprouting → beginning (sprouting)
 * emerging → head out
 * growing → halfway through the body
 * bloomed → full / ready to harvest
 */
export const LEARNING_NODE_STATES = {
  SPROUTING: "LEARNING_NODE_SPROUTING",
  SPROUT_IDLE: "LEARNING_NODE_IDLE",
  SPROUT_TALKING: "LEARNING_NODE_SPROUT_TALKING",
} as const;

export type LearningNodeStateNames =
  (typeof LEARNING_NODE_STATES)[keyof typeof LEARNING_NODE_STATES];
