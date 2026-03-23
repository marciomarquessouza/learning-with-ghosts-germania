export const DIALOGUES = {
  CELL: {
    WELCOME: "cell.welcome",
    MARLENE_FIRST_INTERACTION: "cell.marlene_first_interaction",
    DAILY_CHALLENGE: "cell.daily_challenge",
    DESK_INTERACTION: "cell.desk_interaction",
    FOOD_INTERACTION: "cell.food_interaction",
    RAT_INTERACTION: "cell.rat_interaction",
    BED_INTERACTION: "cell.bed_interaction",
  },

  DREAM: {
    INTRODUCTION: "dream.introduction",
    LESSON_PREPARATION: "dream.lesson_preparation",
    LESSON_FINISH: "dream.lesson_finish",
    CHALLENGE_ACCEPTED: "dream.challenge_accepted",
    RETURN_TO_CELL: "dream.return_to_cell",
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
