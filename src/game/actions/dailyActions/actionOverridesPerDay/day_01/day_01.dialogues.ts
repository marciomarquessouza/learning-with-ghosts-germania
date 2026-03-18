import { CHARACTERS, MOODS } from "@/constants/game";
import { alternatives, dialogue } from "@/libs/dialogues";

export const dialogues = {
  welcome: () => [
    dialogue.player.neutral`
      This cell is my new home.
      I was jailed for not speaking German in Germany.
      Logic... or absurdity?
    `,
    dialogue.player.neutral`
      I don’t want to do anything.
      I don’t want to think.
      I just want to sleep.
    `,
  ],
  marlene_first_interaction: () => [
    dialogue.jailer.neutral`
      Prisoner Josef G.
      Already feeling at home in your cell?
    `,
    dialogue.jailer.neutral`
      In ten minutes your first test begins. 
      The topic: "GREETINGS" in German.
    `,
    dialogue.jailer.neutral`
      Do well, and you eat.
      Fail and you will spend a day hungry to try to improve...
    `,
    dialogue.player.sad`
      But… I have no books. 
      Nothing to study with.
    `,
    dialogue.jailer.happy`
      [MARLENE SMILES] That’s your problem. 
      See you in ten minutes.
    `,
  ],
  bed_alternatives: () => [
    alternatives.player.neutral`
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
    dialogue.player.neutral`
      Wait a second...  
      Could it be that I died...  
      And became a Ghost?
    `,
    dialogue.player.happy`
      Does that mean I don’t need
      to go back to that prison anymore?
    `,
    dialogue.tutor.neutral`
      You didn’t die, Josef — don’t get so smug. ♦  
      You’re only dreaming that you’re dead, a ghost. †  
    `.reactions([
      {
        character: CHARACTERS.PLAYER,
        mood: MOODS.SURPRISED,
      },
    ]),
    dialogue.player.surprised`
      Whose voice is this?  
      Who are you?
    `,
    dialogue.tutor.surprised`
      Walk a bit further, and open your eyes. †
      Then you will see me, darling — lucky you. ♦
    `,
  ],

  lesson_preparation: () => [
    dialogue.player.surprised`
    A confessional… with a nun?
    Who are you?
    What is happening?
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.TUTOR }]),

    dialogue.tutor.talking`
    Don’t overthink it, Josef.
    That’s not your strength.
    You’re dreaming.
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.PLAYER }]),

    dialogue.player.sad`
    I… I don’t understand.
    Why am I here?
    Why are you here?
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.TUTOR }]),

    dialogue.tutor.talking`
    My name is tutor.
    The “why” comes later.
    Now: you need to learn German.
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.PLAYER }]),

    dialogue.player.surprised`
    Learn… in a dream?
    And if I wake up…
    I’ll forget everything.
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.TUTOR }]),

    dialogue.tutor.talking`
    You won’t forget what matters.
    Pass today’s test and you eat.
    Fail it… and you don’t.
    Now… let’s begin, Josef. †
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.PLAYER }]),
  ],

  lesson_finish: () => [
    dialogue.tutor.talking`
    There… that is enough for today, Josef.
    You did well.
    Better than I expected. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.PLAYER }]),

    dialogue.tutor.talking`
    But learning fades quickly.
    So I offer you one more challenge —
    to seal it inside that restless head of yours. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.PLAYER }]),

    alternatives.player.neutral`
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
    dialogue.tutor.talking`
    Oh?
    Braver than you look.
    Come, then.
    Let us see what remains in that head. †
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.PLAYER }]),
  ],
  return_to_cell: () => [
    dialogue.tutor.talking`
    Very well.
    May your memory serve you better than your fear.
    We shall see soon enough. †
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.PLAYER }]),
  ],
};
