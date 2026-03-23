import { ACTORS, MOODS } from "@/constants/game";
import { alternatives, dialogue } from "@/libs/dialogues";
import { defineDialogues } from "@/libs/dialogues/defineDialogues";
import { DefaultDialogues } from "@/libs/dialogues/types";

export const dialogues = defineDialogues<DefaultDialogues>({
  "cell.welcome": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        This cell is my new home.
        I should probably look around...
      `,
    ],
  },

  "cell.marlene_first_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.jailer.angry`
        I hate you Josef
      `,
    ],
  },

  "cell.daily_challenge": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        I don’t want to do the challenge now.
        I’d rather sleep before meeting that terrible woman.
      `,
    ],
  },

  "cell.desk_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        I don’t want to do anything at the table right now.
        I just want to sleep...
      `,
    ],
  },

  "cell.food_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        We won’t have any food until we win the language challenge.
        Forget it. I just want to sleep
      `,
    ],
  },

  "cell.rat_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        It looks like I need to be careful with my food.
        There’s a rat here
      `,
    ],
  },

  "cell.bed_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        Talk to the general at the bars.
        Then we’ll sleep...
      `,
    ],
  },

  "dream.introduction": {
    scene: "DreamScene",
    lines: [
      dialogue.player.surprised`
        Where am I...?
        This doesn't look like the prison anymore.
      `,
    ],
  },

  "dream.lesson_preparation": {
    scene: "DreamScene",
    lines: [
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
  },

  "dream.lesson_finish": {
    scene: "DreamScene",
    lines: [
      dialogue.tutor.neutral`
        That is enough for today.
        Let us see what you remember.
      `.reactions([{ character: ACTORS.PLAYER, mood: MOODS.HAPPY }]),
    ],
  },

  "dream.challenge_accepted": {
    scene: "DreamScene",
    lines: [
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
  },

  "dream.return_to_cell": {
    scene: "DreamScene",
    lines: [
      dialogue.player.neutral`
        I suppose it's time to wake up...
      `,
    ],
  },

  "train.introduction": {
    scene: "TrainScene",
    lines: [
      dialogue.player.surprised`
        A train...?
        How did I get here?
      `,
    ],
  },
});
