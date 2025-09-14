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
      Espera ai...
      Será que eu morri..
      E virei um Fantasma?
    `,
    dialogue.josef.happy`
      Quer dizer que eu nõa preciso mais
      voltar para aquela prisão?
    `,
    dialogue.elisa.neutral`
      Você não morreu Josef...
      Você apenas está sonhando...
      Que é um Fantasma
    `.reactions([
      {
        character: CHARACTERS.JOSEF,
        mood: MOODS.EMBARRASSED,
      },
    ]),
    dialogue.josef.embarrassed`
      De que é esta voz...
      Quem é você?
    `,
    dialogue.elisa.embarrassed`
      Ande um pouco para frente...
      E você verá meu querido
    `,
  ],
};
