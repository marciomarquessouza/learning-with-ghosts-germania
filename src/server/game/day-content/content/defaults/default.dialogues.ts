import { ACTORS, MOODS } from "@/constants/game";
import { dialogue } from "@/libs/dialogues";
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

  "cell.desk_blocked": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        I don’t want to do anything at the table right now.
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

  "cell.food_blocked": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        Não está na hora de comer ainda.
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

  "cell.rat_blocked": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        Não quero mexer nisso agora.
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

  "cell.bed_blocked": {
    scene: "CellScene",
    lines: [
      dialogue.player.neutral`
        Você tem coisas para fazer antes de dormir.
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

  "dream.lesson_begin": {
    scene: "DreamScene",
    lines: [
      dialogue.tutor.talking`
      Let's start a new Lesson Josef.
    `.reactions([{ mood: MOODS.NEUTRAL, character: ACTORS.PLAYER }]),
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

  "dream.review_intro": {
    scene: "DreamScene",
    lines: [
      dialogue.guardian.neutral`
        Olá sonhador.
        Sou o Guardião da Memória.
        Vejo que traz pequenos conhecimentos para mim.
      `.reactions([{ character: ACTORS.GUARDIAN, mood: MOODS.NEUTRAL }]),
      dialogue.guardian.neutral`
        Caso se lembre corretamente o nome de cada conhecimento
        Este será enviado ao Lago da Memória
        E Mnemosyne cuidará dle...
      `.reactions([{ character: ACTORS.GUARDIAN, mood: MOODS.NEUTRAL }]),
      dialogue.guardian.neutral`
        Mas caso não se recorde corretamente ou tenha esquecido em completo
        Ele será enviado ao Lago do Esquecimento
        Para os braços de Lethe
      `.reactions([{ character: ACTORS.GUARDIAN, mood: MOODS.NEUTRAL }]),
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
