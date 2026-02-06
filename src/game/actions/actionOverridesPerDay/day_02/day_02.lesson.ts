import { CHARACTERS } from "@/constants/game";
import { Lesson } from "@/types";

export const lesson: Lesson = {
  id: "greetings",
  day: 1,
  title: "Greetings",
  character: CHARACTERS.ELISA,
  entries: [
    {
      id: "1",
      reference: "Hello",
      target: "Hallo",
      steps: [
        {
          type: "introduction",
          text: `Our first word is “Hallo”. It’s the neutral, everyday way to start a conversation in German — friendly and safe in almost any context.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `HA-loh (like “HAH-loh”). The first syllable is short, the final “o” is an open “oh”.`,
          instruction: "Your turn. Click the mic and say: “{{audio|Hallo}}”.",
        },
        {
          type: "writing",
          text: `Let us move on. Listen to the audio and complete the word by clicking on the letters in the correct sequence.`,
          instruction: "",
        },
      ],
    },
    {
      id: "2",
      reference: "Good day",
      target: "Guten Tag",
      steps: [
        {
          type: "introduction",
          text: `“Guten Tag” is a polite daytime greeting — used from late morning to late afternoon. Slightly more formal than “Hallo”, but still very common.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Try it with me: “Guten Tag”. Keep “Tag” short, firm, and clean: tahk.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Guten Tag}}”.",
        },
        {
          type: "writing",
          text: `All right. Now listen to the audio and build the word by selecting the letters in the correct order.`,
          instruction: "",
        },
      ],
    },
    {
      id: "3",
      reference: "Good evening",
      target: "Guten Abend",
      steps: [
        {
          type: "introduction",
          text: `“Guten Abend” is used in the evening — usually after 6 or 7 pm. It’s polite and works in both formal and casual situations.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Say it smoothly: “Guten Abend”. Keep the flow steady: GOO-ten AH-bent.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Guten Abend}}”.",
        },
        {
          type: "writing",
          text: `Let us continue. Listen to the audio and complete the word by choosing the letters in sequence.`,
          instruction: "",
        },
      ],
    },
    {
      id: "4",
      reference: "Good night",
      target: "Gute Nacht",
      steps: [
        {
          type: "introduction",
          text: `“Gute Nacht” is used when parting for the night or going to sleep. It’s not a greeting to start a conversation — it’s a nighttime farewell.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Try it out: “Gute Nacht”. Aim for a clear, throaty “ch”: nahkt.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Gute Nacht}}”.",
        },
        {
          type: "writing",
          text: `Proceed. Listen to the audio and complete the word by selecting the letters in the right order.`,
          instruction: "",
        },
      ],
    },
    {
      id: "5",
      reference: "Bye",
      target: "Tschüss",
      steps: [
        {
          type: "introduction",
          text: `“Tschüss” is an informal, friendly way to say “bye”. Great for casual situations and people you know well.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Say: “Tschüss”. Keep the “ü” long and rounded — close to the French “u”.`,
          instruction: "Your turn. Click the mic and say: “{{audio|Tschüss}}”.",
        },
        {
          type: "writing",
          text: `Let us move forward. Listen to the audio and complete the word by clicking the letters in the correct sequence.`,
          instruction: "",
        },
      ],
    },
    {
      id: "6",
      reference: "Goodbye",
      target: "Auf Wiedersehen",
      steps: [
        {
          type: "introduction",
          text: `“Auf Wiedersehen” is the polite, standard way to say “goodbye”. More formal than “Tschüss” — appropriate for strangers or professional settings.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Say it clearly: “Auf Wiedersehen”. Don’t rush the middle: VEE-der-zay-en.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Auf Wiedersehen}}”.",
        },
        {
          type: "writing",
          text: `Next step. Listen to the audio and assemble the word by choosing the letters in the correct order.`,
          instruction: "",
        },
      ],
    },
    {
      id: "7",
      reference: "See you soon",
      target: "Bis bald",
      steps: [
        {
          type: "introduction",
          text: `“Bis bald” means “see you soon”. Casual and warm — it suggests you expect to meet again in the near future.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Try it: “Bis bald”. Give the final “d” a clean, crisp finish.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Bis bald}}”.",
        },
        {
          type: "writing",
          text: `Let us continue. Listen to the audio and complete the word by selecting the letters in order.`,
          instruction: "",
        },
      ],
    },
    {
      id: "8",
      reference: "See you later",
      target: "Bis später",
      steps: [
        {
          type: "introduction",
          text: `“Bis später” means “see you later (today)”. It usually implies that you’ll meet again later the same day.`,
          instruction: "Listen and repeat (don’t be shy, say it out loud!)",
        },
        {
          type: "pronunciation",
          text: `Say: “Bis später”. If the “ä” is difficult, aim for a clean “eh”: SHPAY-ter.`,
          instruction:
            "Your turn. Click the mic and say: “{{audio|Bis später}}”.",
        },
        {
          type: "writing",
          text: `Final step. Listen to the audio and complete the word by clicking the letters in the correct sequence.`,
          instruction: "",
        },
      ],
    },
  ],
};
