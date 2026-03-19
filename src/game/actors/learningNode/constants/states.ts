/**
 * sprouting → beginning (sprouting)
 * emerging → head out
 * growing → halfway through the body
 * bloomed → full / ready to harvest
 */
export const LEARNING_NODE_STATES = {
  SPROUTING: "LEARNING_NODE_SPROUTING",
  EMERGING: "LEARNING_NODE_EMERGING",
  GROWING: "LEARNING_NODE_GROWING",
  BLOOMED: "LEARNING_NODE_BLOOMED",
} as const;

export type LearningNodeStateNames =
  (typeof LEARNING_NODE_STATES)[keyof typeof LEARNING_NODE_STATES];
