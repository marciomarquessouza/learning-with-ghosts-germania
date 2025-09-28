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
      Who the hell are you? What is happening?
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.happy`
      Hello, Josef. My name is Eliska. †  
      Unlike you, I’m dead — a fucking ghost. ♦  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.surprised`
      You… you’re really dead?  
      How can you even talk to me?  
      How did you crawl into my dream?  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
      Oh, sweet Jesus… you’re slow as shit. ♦  
      Fine, let me spell it out: I’m a ghost. †  
      I sneak inside your dreams because I can. †  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      My name is Eliska. I was a nun once. †  
      I rotted in this cell and starved to death. †  
      And guess what? Heaven slammed its fucking gates. ♦  
      So here I am — stuck talking to your ass. ♦  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.surprised`
      Eliska? You’re… Saint Virgin Eliska?
      Patron of Expatriates?
      The one who died teaching German to immigrants?
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
      They slapped “Virgin” on me — hell of a brand. †  
      Sure, I died teaching, but not for free, dumbass. ♦  
      And now it seems I’ll do the same for you. †  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    dialogue.josef.sad`
      Thank you, Saint Eliska… but I don’t want this.  
      I’d rather die and be a ghost like you.  
  `.reactions([{ mood: MOODS.TALKING, character: CHARACTERS.ELISA }]),

    dialogue.elisa.talking`
      Don’t call me saint — I was never holy. †  
      But hell, maybe you need motivation. †  
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      Here’s the deal: if you do today’s damn lesson, ♦  
      I’ll throw you a reward. ♦  
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.flushed`
      I could tell you a secret — filthy, private. ♦  
      Something no living soul has ever known… †  
      or maybe… ♦  
  `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),

    dialogue.elisa.talking`
      As a ghost I picked up some nasty powers. †  
      I can see your future, Josef. ♦  
      I could spill it, right here. ♦  
  `.reactions([{ mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF }]),

    alternatives.josef.neutral`
      What reward do you want from Eliska?
  `.alternatives(
      { text: "Eliska’s dirty secret", id: "eliska_secret" },
      { text: "Know your future", id: "josef_future" },
      { text: "Skip the lesson and wake up", id: "exit" }
    ),
  ],
  post_introduction_eliska_secret: () => [
    dialogue.elisa.flushed`
      A secret, Josef? You’ll have to earn that sin. ♦  
      First learn to greet me — say “Hallo” like a man. †  
      Whisper it well, and maybe I’ll whisper back. ♦  
    `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],
  post_introduction_josef_future: () => [
    dialogue.elisa.flushed`
      Your future waits, but greetings come before graves. †  
      Say “Guten Tag,” and face the world you dread. †  
      Without a tongue for welcome, fate stays silent. ♦  
    `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],
  post_introduction_exit: () => [
    dialogue.elisa.flushed`
      Wake up? Idiot. The dead still need to greet. ♦  
      Even ghosts say “Hallo” before they haunt. †  
      Try it, or keep your rotten mouth shut tight. ♦ 
    `.reactions([{ mood: MOODS.NEUTRAL, character: CHARACTERS.JOSEF }]),
  ],
};
