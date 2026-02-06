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
  ],
};
