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
      },
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
      You didn’t die, Josef — don’t get so smug. ♦  
      You’re only dreaming that you’re dead, a ghost. †  
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
      Walk a bit further, and open your eyes. †
      Then you will see me, darling — lucky you. ♦
    `,
  ],

  lesson_preparation: () => [
    dialogue.josef.surprised`
    A confessional… with a nun?
    Who are you?
    What is happening?
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
    Don’t overthink it, Josef.
    That’s not your strength.
    You’re dreaming.
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.sad`
    I… I don’t understand.
    Why am I here?
    Why are you here?
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
    My name is Elisa.
    The “why” comes later.
    Now: you need to learn German.
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.surprised`
    Learn… in a dream?
    And if I wake up…
    I’ll forget everything.
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
    You won’t forget what matters.
    Pass today’s test and you eat.
    Fail it… and you don’t.
    Now… let’s begin, Josef. †
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],

  lesson_finish: () => [
    dialogue.elisa.talking`
    There… that is enough for today, Josef.
    You did well.
    Better than I expected. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
    But learning fades quickly.
    So I offer you one more challenge —
    to seal it inside that restless head of yours. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    alternatives.josef.neutral`
    What kind of challenge?
  `.alternatives(
      {
        id: "train_challenge",
        text: "Accept the nun’s challenge.",
      },
      {
        id: "return",
        text: "Wake up and face the final test.",
      },
    ),
  ],
  challenge_accepted: () => [
    dialogue.elisa.talking`
    Oh?
    Braver than you look.
    Come, then.
    Let us see what remains in that head. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),
  ],
  return_to_cell: () => [
    dialogue.elisa.talking`
    Very well.
    May your memory serve you better than your fear.
    We shall see soon enough. †
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],
};
