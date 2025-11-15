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
          instruction: "Escute e repita (não tenha vergonha, fale alto mesmo!)",
        },
        {
          type: "pronunciation",
          text: `HA-loh (like “HAH-loh”). The first syllable is short, the final “o” is an open “oh”.`,
          instruction: "Your turn. Click the mic and say: “{{audio|Hallo}}”.",
        },
        {
          type: "writing",
          text: `Vamos agora para um desafio de memória. Escute e escrevva`,
          instruction: "Escreva o que você escutar neste {{audio|Audio}} .",
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
          instruction:
            "Escute com atenção — imagine-se encontrando alguém importante.",
        },
        {
          type: "pronunciation",
          text: `Mic on. Say: “Guten Tag”. Keep “Tag” short and firm: tahk.`,
          instruction: "Ative o microfone e repita com firmeza.",
        },
        {
          type: "writing",
          text: `Type it: Guten Tag. (Both words capitalized.)`,
          instruction:
            "Digite exatamente como mostrado — sem preguiça com as maiúsculas.",
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
          instruction:
            "Imagine-se chegando a um jantar elegante. Diga com calma.",
        },
        {
          type: "listening",
          text: `Pronunciation: GOO-ten AH-bent. The “A” in “Abend” is open (“AH”), and the final “d” is soft. I’ll say it 3 times. Focus on the open “AH”.`,
          instruction:
            "Escute e repita mentalmente antes de tentar em voz alta.",
        },
        {
          type: "pronunciation",
          text: `Your turn: “Guten Abend”. Keep the rhythm smooth: GOO-ten AH-bent.`,
          instruction: "Repita lentamente, sem engolir as vogais.",
        },
        {
          type: "writing",
          text: `Type it: Guten Abend. (Both words capitalized.)`,
          instruction: "Digite com atenção aos acentos e maiúsculas.",
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
          instruction: "Use apenas ao se despedir — não para iniciar conversa.",
        },
        {
          type: "listening",
          text: `Pronunciation: GOO-tə nahkt. “Nacht” has the German “ch” (like in “Bach”), a harsh breathy sound.
                 I’ll say it 3 times. Listen for the “ch” in Nacht.`,
          instruction:
            "Tente perceber o som do “ch” alemão — respire fundo e sopre.",
        },
        {
          type: "pronunciation",
          text: `Mic time: “Gute Nacht”. Aim for that throaty “ch”: nahkt.`,
          instruction: "Repita — sem medo do som gutural.",
        },
        {
          type: "writing",
          text: `Type it: Gute Nacht. (Both words capitalized.)`,
          instruction: "Digite calmamente e revise antes de enviar.",
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
          instruction: "Use com amigos, nunca com seu chefe.",
        },
        {
          type: "listening",
          text: `Pronunciation: roughly “chooss”, but with German “ü” (rounded lips, like French “tu”): tʃyːs. I’ll say it 3 times. Try to keep your lips rounded on “ü”.`,
          instruction:
            "Observe o som do “ü”. Redonde os lábios sem fazer bico.",
        },
        {
          type: "pronunciation",
          text: `Say it into the mic: “Tschüss”. Keep the “ü” long and rounded: tʃyːs.`,
          instruction: "Diga claramente — e sorria ao terminar.",
        },
        {
          type: "writing",
          text: `Type it: Tschüss. (Capital T, and note the “ü”. If you can’t type “ü”, you can use “Tschuess” as a fallback.)`,
          instruction: "Digite com o “ü” correto — ou “ue” se preferir.",
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
          instruction: "Diga com respeito — imagine-se deixando uma reunião.",
        },
        {
          type: "listening",
          text: `Pronunciation: owf VEE-der-zay-en. Say it in four beats: Auf | Wie-der | se-hen. I’ll say it 3 times. Keep the flow steady.`,
          instruction: "Conte os quatro tempos enquanto escuta.",
        },
        {
          type: "pronunciation",
          text: `Your turn: “Auf Wiedersehen”. Don’t rush the middle: VEE-der.`,
          instruction: "Repita pausadamente, mantendo o ritmo.",
        },
        {
          type: "writing",
          text: `Type it: Auf Wiedersehen. (Capital A and W.)`,
          instruction: "Digite com calma — é uma despedida elegante.",
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
          instruction: "Pense em alguém querido — diga com leveza.",
        },
        {
          type: "listening",
          text: `Pronunciation: biss balt. Short, crisp consonants. I’ll say it 3 times. Keep both words short.`,
          instruction: "Escute atentamente o som curto e seco das consoantes.",
        },
        {
          type: "pronunciation",
          text: `Mic on: “Bis bald”. Hit the final “d” clearly: bald.`,
          instruction: "Ative o microfone e fale sem hesitar.",
        },
        {
          type: "writing",
          text: `Type it: Bis bald. (Only the B of “Bis” is capitalized.)`,
          instruction: "Digite exatamente assim — simples e direto.",
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
          instruction: "Use quando for rever alguém ainda hoje.",
        },
        {
          type: "listening",
          text: `Pronunciation: biss SHPAY-ter. “spä-” has “ä” like “eh” (long), and “t” is clear. I’ll say it 3 times. Focus on SHPAY.`,
          instruction: "Escute o “ä” com atenção — prolongue o som levemente.",
        },
        {
          type: "pronunciation",
          text: `Your turn: “Bis später”. If you can’t say “ä”, aim for “eh”: SHPAY-ter.`,
          instruction: "Repita tentando acertar o “ä”. Sem pressa.",
        },
        {
          type: "writing",
          text: `Type it: Bis später. (Only the B of “Bis” is capitalized; “ä” can be written as “ae” → “Bis spaeter”.)`,
          instruction: "Digite e pratique a alternativa com “ae”.",
        },
      ],
      phase: "hide",
    },
  ],
};
