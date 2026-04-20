import { ACTORS, MOODS } from "@/constants/game";
import { alternatives, dialogue } from "@/libs/dialogues";
import { defineDialogues } from "@/libs/dialogues/defineDialogues";
import { DayDialogues } from "@/libs/dialogues/types";

export const dialogues = defineDialogues<DayDialogues>({
  "cell.welcome": {
    scene: "CellScene",
    lines: [
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
  },

  "cell.marlene_first_interaction": {
    scene: "CellScene",
    lines: [
      dialogue.jailer.neutral`
      Prisoner Josef G.
      My name is Marlene Weiss.
      I am the jailer responsible
      for the wing of non-German speakers.
    `,
      dialogue.jailer.neutral`
      You may only speak your native language when I allow it.
      You will only leave this place when you speak German.
      And you will only eat if you SPEAK GERMAN.
    `,
      dialogue.jailer.neutral`
      At the first hour of the morning
      I will give you a German test.
      The subject will be GERMAN GREETINGS.
    `,
      dialogue.jailer.neutral`
      You will receive your meal
      only if you pass the test.
      If you fail,
      hunger will improve your motivation.
    `,
      dialogue.player.sad`
      But… I have no books.
      I have nothing in this cell
      to learn German.
    `,
      dialogue.jailer.neutral`
      That is not my problem.
      It is time to sleep. The lights will be turned off.
      I will return early tomorrow with your test.
    `,
    ],
  },

  "cell.bed_interaction": {
    scene: "CellScene",
    lines: [
      alternatives.player.neutral`
        What do you want to do?
      `.alternatives(
        {
          id: "dream",
          text: "Sleep until the challenge arrives",
        },
        {
          id: "nothing",
          text: "Do nothing",
        },
      ),
    ],
  },

  "dream.introduction": {
    scene: "DreamScene",
    lines: [
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
          character: ACTORS.PLAYER,
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
  },

  "dream.lesson_preparation": {
    scene: "DreamScene",
    lines: [
      dialogue.player.surprised`
        A confessional… with a nun?
        Who are you?
        What is happening?
      `.reactions([{ mood: MOODS.TALKING, character: ACTORS.TUTOR }]),

      dialogue.tutor.talking`
        Don’t overthink it, Josef.
        That’s not your strength.
        You’re dreaming.
      `.reactions([{ mood: MOODS.SURPRISED, character: ACTORS.PLAYER }]),

      dialogue.player.sad`
        I… I don’t understand.
        Why am I here?
        Why are you here?
      `.reactions([{ mood: MOODS.TALKING, character: ACTORS.TUTOR }]),

      dialogue.tutor.talking`
        My name is tutor.
        The “why” comes later.
        Now: you need to learn German.
      `.reactions([{ mood: MOODS.SURPRISED, character: ACTORS.PLAYER }]),

      dialogue.player.surprised`
        Learn… in a dream?
        And if I wake up…
        I’ll forget everything.
      `.reactions([{ mood: MOODS.TALKING, character: ACTORS.TUTOR }]),

      dialogue.tutor.talking`
        You won’t forget what matters.
        Pass today’s test and you eat.
        Fail it… and you don’t.
        Now… let’s begin, Josef. †
      `.reactions([{ mood: MOODS.NEUTRAL, character: ACTORS.PLAYER }]),
    ],
  },

  "dream.lesson_finish": {
    scene: "DreamScene",
    lines: [
      dialogue.tutor.talking`
        There… that is enough for today, Josef.
        You did well.
        Better than I expected. †
      `.reactions([{ mood: MOODS.SURPRISED, character: ACTORS.PLAYER }]),

      dialogue.tutor.talking`
        But learning fades quickly.
        So I offer you one more challenge —
        to seal it inside that restless head of yours. †
      `.reactions([{ mood: MOODS.SURPRISED, character: ACTORS.PLAYER }]),

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
  },

  "dream.challenge_accepted": {
    scene: "DreamScene",
    lines: [
      dialogue.tutor.talking`
        Oh?
        Braver than you look.
        Come, then.
        Let us see what remains in that head. †
      `.reactions([{ mood: MOODS.SURPRISED, character: ACTORS.PLAYER }]),
    ],
  },

  "dream.return_to_cell": {
    scene: "DreamScene",
    lines: [
      dialogue.tutor.talking`
        Very well.
        May your memory serve you better than your fear.
        We shall see soon enough. †
      `.reactions([{ mood: MOODS.NEUTRAL, character: ACTORS.PLAYER }]),
    ],
  },
});
