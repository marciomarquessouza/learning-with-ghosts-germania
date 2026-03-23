import { alternatives, dialogue } from "@/libs/dialogues";
import { InteractionLine } from "@/libs/dialogues/types";

export const dialogues: Record<string, () => InteractionLine[]> = {
  before_sleep: () => [
    dialogue.player.neutral`
		Talk to the general at the bars.
		Then we’ll sleep...
	`,
  ],
  default_challenge_dialogue: () => [
    dialogue.player.neutral`
		I don’t want to do the challenge now.
		I’d rather sleep before meeting that terrible woman.
	`,
  ],
  default_desk_dialogue: () => [
    dialogue.player.neutral`
		I don’t want to do anything at the table right now.
		I just want to sleep...
	`,
  ],
  default_food_dialogue: () => [
    dialogue.player.neutral`
		We won’t have any food until we win the language challenge.
		Forget it. I just want to sleep
	`,
  ],
  default_rat_dialogue: () => [
    dialogue.player.neutral`
		It looks like I need to be careful with my food.
		There’s a rat here
	`,
  ],
  default_lesson_preparation: () => [
    dialogue.tutor.neutral`
		Bem vindo para mais um dia de aula Josef.
		Vamos plantas mais algumas palavras no seu cu.
	`,
    dialogue.player.surprised`
		O que?
	`,
    dialogue.tutor.neutral`
		Digo... na sua cabeça
	`,
  ],
  default_bed_dialogue: () => [
    dialogue.player.neutral`
		"I don't want to do anything in bed right now"
	`,
  ],
  default_marlene_first_dialogue: () => [
    dialogue.jailer.angry`
		"I hate you Josef"
	`,
  ],
  daily_challenge_alternatives: () => [
    alternatives.jailer.neutral`
		Você realmente quer iniciar o desafio do dia agora?
	`.alternatives(
      {
        id: "skip",
        text: "NÃO - eu quero me preparar mais",
      },
      {
        id: "challenge",
        text: "SIM - eu quero fayer o desafio agora!",
      },
    ),
  ],
};
