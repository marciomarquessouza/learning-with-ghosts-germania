export const DIALOGUES = {
  CELL: {
    WELCOME: "cell.welcome",
    MARLENE_FIRST_INTERACTION: "cell.marlene_first_interaction",
    DAILY_CHALLENGE: "cell.daily_challenge",
    DESK_INTERACTION: "cell.desk_interaction",
    DESK_BLOCKED: "cell.desk_blocked",
    FOOD_INTERACTION: "cell.food_interaction",
    FOOD_BLOCKED: "cell.food_blocked",
    RAT_INTERACTION: "cell.rat_interaction",
    RAT_BLOCKED: "cell.rat_blocked",
    BED_INTERACTION: "cell.bed_interaction",
    BED_BLOCKED: "cell.bed_blocked",
  },

  DREAM: {
    // game
    INTRODUCTION: "dream.introduction",
    // Lesson
    LESSON_PREPARATION: "dream.lesson_preparation",
    LESSON_BEGIN: "dream.lesson_begin",
    LESSON_FINISH: "dream.lesson_finish",
    // Review
    REVIEW_INTRO: "dream.review_intro",
  },

  TRAIN: {
    INTRODUCTION: "train.introduction",
  },
} as const;

type ValueOf<T> = T[keyof T];

export type DialogueKey =
  | ValueOf<typeof DIALOGUES.CELL>
  | ValueOf<typeof DIALOGUES.DREAM>
  | ValueOf<typeof DIALOGUES.TRAIN>;
