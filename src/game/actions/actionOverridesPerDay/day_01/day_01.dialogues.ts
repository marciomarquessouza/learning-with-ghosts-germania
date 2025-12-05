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
      Who are you? What is happening?
    `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.happy`
      Hello, Josef… my name is Elisa. †  
      And… yes. I’m dead.  
      I’m just a little ghost inside your dream. ♦  
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.surprised`
      You… you’re really dead?  
      Then how can you talk to me?  
      How did you enter my dream?  
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
      The radio you were listening to before falling asleep… it calls me. ♦  
      I can follow the sound and slip inside, very quietly. †   
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      I don’t know how to explain it better… I just know I can. 
      And I can help you pass today’s test…  
      and earn your meal as well. †  
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.surprised`
      Elisa… now I remember you.  
      You were that nun from Poland…  
      who taught German to foreigners in the church…  
      and later on the radio too.
    `.reactions([{ mood: MOODS.SAD, character: CHARACTERS.ELISA }]),

    dialogue.elisa.sad`
      Yes… that was me. †  
      And I… I met you when I was alive.  
      But it’s alright if you don’t remember clearly…  
      Dreams never show everything at once.  
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.sad`
      What matters is that you’re here now.  
      I can teach you what you need for today’s exam. †  
    `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.sad`
      Oh… okay.  
      But I’m going to forget everything when I wake up, aren’t I?
    `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
      Don’t be afraid of that. After the lesson is over…  
      I will help you remember. I always will.  
      Now… let’s begin, Josef. †  
    `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],

  lesson_finish: () => [
    dialogue.elisa.talking`
      There… that’s all for today, Josef. You did very well… †  
      even if it might not feel like it right now.  
      In dreams everything gets a little tangled, you know?  
      But… it’s all inside you.  
    `.reactions([{ mood: MOODS.SAD, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      When you wake up… you might forget a little,  
      but that’s alright.  
      I’ll guide you again — every time you come back. †  
    `.reactions([{ mood: MOODS.SAD, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      Now… rest.  
      The dream is getting weak…  
      and I have to let you go.  
    `.reactions([{ mood: MOODS.SAD, character: CHARACTERS.JOSEF }]),
  ],
};
