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
        },
        {
          type: "listening",
          text: `Pronunciation: HA-loh (like “HAH-loh”). The first syllable is short, the final “o” is an open “oh”. I’ll say it 3 times. Try to memorize the sound.`,
        },
        {
          type: "pronunciation",
          text: `Your turn. Click the mic and say: “Hallo”. Keep it short and clear: HA-loh.`,
        },
        {
          type: "writing",
          text: `Type it exactly as you heard it: Hallo. (Capital H, then “allo”.)`,
        },
      ],
      phase: "visible",
    },

    {
      id: "2",
      reference: "Good day",
      target: "Guten Tag",
      steps: [
        {
          type: "introduction",
          text: `“Guten Tag” is a polite daytime greeting (roughly late morning to late afternoon). Slightly more formal than “Hallo”.`,
        },
        {
          type: "listening",
          text: `Pronunciation: GOO-ten tahk. “Guten” has a long “oo”; “Tag” ends with a hard “k” sound. I’ll say it 3 times. Listen for the crisp “k” at the end.`,
        },
        {
          type: "pronunciation",
          text: `Mic on. Say: “Guten Tag”. Keep “Tag” short and firm: tahk.`,
        },
        {
          type: "writing",
          text: `Type it: Guten Tag. (Both words capitalized.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "3",
      reference: "Good evening",
      target: "Guten Abend",
      steps: [
        {
          type: "introduction",
          text: `“Guten Abend” is used in the evening (roughly after 6–7 pm). It’s polite and works in formal or casual settings.`,
        },
        {
          type: "listening",
          text: `Pronunciation: GOO-ten AH-bent. The “A” in “Abend” is open (“AH”), and the final “d” is soft. I’ll say it 3 times. Focus on the open “AH”.`,
        },
        {
          type: "pronunciation",
          text: `Your turn: “Guten Abend”. Keep the rhythm smooth: GOO-ten AH-bent.`,
        },
        {
          type: "writing",
          text: `Type it: Guten Abend. (Both words capitalized.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "4",
      reference: "Good night",
      target: "Gute Nacht",
      steps: [
        {
          type: "introduction",
          text: `“Gute Nacht” is said at night when parting or going to sleep. It’s a farewell at night, not a greeting to start a chat.`,
        },
        {
          type: "listening",
          text: `Pronunciation: GOO-tə nahkt. “Nacht” has the German “ch” (like in “Bach”), a harsh breathy sound.
                 I’ll say it 3 times. Listen for the “ch” in Nacht.`,
        },
        {
          type: "pronunciation",
          text: `Mic time: “Gute Nacht”. Aim for that throaty “ch”: nahkt.`,
        },
        {
          type: "writing",
          text: `Type it: Gute Nacht. (Both words capitalized.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "5",
      reference: "Bye",
      target: "Tschüss",
      steps: [
        {
          type: "introduction",
          text: `“Tschüss” is informal “bye”. Great with friends and casual situations.`,
        },
        {
          type: "listening",
          text: `Pronunciation: roughly “chooss”, but with German “ü” (rounded lips, like French “tu”): tʃyːs. I’ll say it 3 times. Try to keep your lips rounded on “ü”.`,
        },
        {
          type: "pronunciation",
          text: `Say it into the mic: “Tschüss”. Keep the “ü” long and rounded: tʃyːs.`,
        },
        {
          type: "writing",
          text: `Type it: Tschüss. (Capital T, and note the “ü”. If you can’t type “ü”, you can use “Tschuess” as a fallback.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "6",
      reference: "Goodbye",
      target: "Auf Wiedersehen",
      steps: [
        {
          type: "introduction",
          text: `“Auf Wiedersehen” is the standard polite “goodbye”. More formal than “Tschüss”; safe with strangers and in professional contexts.`,
        },
        {
          type: "listening",
          text: `Pronunciation: owf VEE-der-zay-en. Say it in four beats: Auf | Wie-der | se-hen. I’ll say it 3 times. Keep the flow steady.`,
        },
        {
          type: "pronunciation",
          text: `Your turn: “Auf Wiedersehen”. Don’t rush the middle: VEE-der.`,
        },
        {
          type: "writing",
          text: `Type it: Auf Wiedersehen. (Capital A and W.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "7",
      reference: "See you soon",
      target: "Bis bald",
      steps: [
        {
          type: "introduction",
          text: `“Bis bald” means “see you soon”. Casual, warm, used when you expect to meet again in the near future.`,
        },
        {
          type: "listening",
          text: `Pronunciation: biss balt. Short, crisp consonants. I’ll say it 3 times. Keep both words short.`,
        },
        {
          type: "pronunciation",
          text: `Mic on: “Bis bald”. Hit the final “d” clearly: bald.`,
        },
        {
          type: "writing",
          text: `Type it: Bis bald. (Only the B of “Bis” is capitalized.)`,
        },
      ],
      phase: "hide",
    },

    {
      id: "8",
      reference: "See you later",
      target: "Bis später",
      steps: [
        {
          type: "introduction",
          text: `“Bis später” = “see you later (today)”. It implies later the same day. Use it when you’ll meet again soon-ish.`,
        },
        {
          type: "listening",
          text: `Pronunciation: biss SHPAY-ter. “spä-” has “ä” like “eh” (long), and “t” is clear. I’ll say it 3 times. Focus on SHPAY.`,
        },
        {
          type: "pronunciation",
          text: `Your turn: “Bis später”. If you can’t say “ä”, aim for “eh”: SHPAY-ter.`,
        },
        {
          type: "writing",
          text: `Type it: Bis später. (Only the B of “Bis” is capitalized; “ä” can be written as “ae” → “Bis spaeter”.)`,
        },
      ],
      phase: "hide",
    },
  ],
};
