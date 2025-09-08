import { dialogue } from "@/utils/dialogues";

export const defaultDialogues = {
  before_sleep: () => [
    dialogue.josef.neutral`
		Talk to the general at the bars.
		Then we’ll sleep...
	`,
  ],
  default_challenge_dialogue: () => [
    dialogue.josef.neutral`
		I don’t want to do the challenge now.
		I’d rather sleep before meeting that terrible woman.
	`,
  ],
  default_desk_dialogue: () => [
    dialogue.josef.neutral`
		I don’t want to do anything at the table right now.
		I just want to sleep...
	`,
  ],
  default_food_dialogue: () => [
    dialogue.josef.neutral`
		We won’t have any food until we win the language challenge.
		Forget it. I just want to sleep
	`,
  ],
  default_rat_dialogue: () => [
    dialogue.josef.neutral`
		It looks like I need to be careful with my food.
		There’s a rat here
	`,
  ],
};
