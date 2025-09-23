import { CHARACTERS, MOODS } from "@/constants/game";
import { alternatives, dialogue } from "@/utils/dialogues";

export const dialogues = {
  welcome: () => [
    dialogue.josef.neutral`
      This cell is my new home.
      I was jailed for not speaking German in Germany.
      Logic... or absurdity?
    `,
    dialogue.josef.neutral`
      I don’t want to do anything.
      I don’t want to think.
      I just want to sleep.
    `,
  ],
  marlene_first_interaction: () => [
    dialogue.marlene.neutral`
      Prisoner Josef G.
      Already feeling at home in your cell?
    `,
    dialogue.marlene.neutral`
      In ten minutes your first test begins. 
      The topic: "GREETINGS" in German.
    `,
    dialogue.marlene.neutral`
      Do well, and you eat.
      Fail and you will spend a day hungry to try to improve...
    `,
    dialogue.josef.sad`
      But… I have no books. 
      Nothing to study with.
    `,
    dialogue.marlene.happy`
      [MARLENE SMILES] That’s your problem. 
      See you in ten minutes.
    `,
  ],
  bed_alternatives: () => [
    alternatives.josef.neutral`
      What do you want to do?
    `.alternatives(
      {
        id: "sleeping_with_ghosts",
        text: "Sleep until the challenge arrives",
      },
      {
        id: "nothing",
        text: "Do nothing",
      }
    ),
  ],
  dream_introduction: () => [
    dialogue.josef.neutral`
      Wait a second...
      Could it be that I died...
      And became a Ghost?
    `,
    dialogue.josef.happy`
      Does that mean I don’t need
      to go back to that prison anymore?
    `,
    dialogue.elisa.neutral`
      You didn’t die, Josef...
      You’re just dreaming...
      That you’re a Ghost.
    `.reactions([
      {
        character: CHARACTERS.JOSEF,
        mood: MOODS.SURPRISED,
      },
    ]),
    dialogue.josef.surprised`
      Whose voice is this?
      Who are you?
    `,
    dialogue.elisa.surprised`
      Walk a little forward...
      And you will see, my dear.
    `,
  ],
  lesson_preparation: () => [
    dialogue.josef.surprised`
      O que... um confessionario com uma... freira?
      Quem é você? O que está acontecendo?
    `.reactions([
      {
        mood: MOODS.NEUTRAL,
        character: CHARACTERS.ELISA,
      },
    ]),
    dialogue.elisa.happy`
      Olá Josef! Meu nome Eliska.
      Eu sou um fantasma... de verdade.
      Eu morri na mesma cela que voce está agora.
    `.reactions([
      {
        mood: MOODS.NEUTRAL,
        character: CHARACTERS.JOSEF,
      },
    ]),
    dialogue.josef.surprised`
      Voce... esta realmente morta?
      Mas... como você pode falar comigo?
      Eu estou sonhando?
    `.reactions([
      {
        mood: MOODS.SURPRISED,
        character: CHARACTERS.ELISA,
      },
    ]),
    dialogue.elisa.happy`
      Oh... que bonitinho. Voce eh do tipo lerdo e burro. Que sorte a minha.
      Eu morri de forme e fui enterrada debaixo da cama que voce esta rocando como um porco agora.
      Eu nao fui para o ceu e de algum modo eu posso comunicar com voce nos seus sonhos.
    `.reactions([
      {
        mood: MOODS.SURPRISED,
        character: CHARACTERS.JOSEF,
      },
    ]),
    dialogue.elisa.neutral`
      Veja que sorte a minha. 
      Em vez de encontrar Deus eu encontro... voce. 
      Como poderia ser melhor....
    `.reactions([
      {
        mood: MOODS.SURPRISED,
        character: CHARACTERS.JOSEF,
      },
    ]),
    dialogue.josef.surprised`
      Eliska? Você é... a Santa Virgem Eliska?
      A Padroeira dos Expatriados?
      Aquela que morreu por ensinar Alemão aos pobres?
    `.reactions([
      {
        mood: MOODS.SURPRISED,
        character: CHARACTERS.ELISA,
      },
    ]),
  ],
};
