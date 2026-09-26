import { ContentImporters } from "@/server/types";

// AUTO-GENERATED FILE. DO NOT EDIT.
const generatedContentImporters = {
  "de-DE": {
    "A1-1": {
      "1": {
        lesson: () => import("../content/de-DE/A1-1/days/day_01/lesson.json"),
        audio: () => import("../content/de-DE/A1-1/days/day_01/audio.json"),
        locales: {
          "pt-BR": () =>
            import("../content/de-DE/A1-1/days/day_01/locales/pt-BR.json"),
          "en-UK": () =>
            import("../content/de-DE/A1-1/days/day_01/locales/en-UK.json"),
        },
      },
    },
  },
  "en-UK": {
    "A1-1": {
      "1": {
        lesson: () => import("../content/en-UK/A1-1/days/day_01/lesson.json"),
        audio: () => import("../content/en-UK/A1-1/days/day_01/audio.json"),
        locales: {
          "pt-BR": () =>
            import("../content/en-UK/A1-1/days/day_01/locales/pt-BR.json"),
        },
      },
    },
  },
} satisfies ContentImporters;

export const contentImporters: ContentImporters = generatedContentImporters;
