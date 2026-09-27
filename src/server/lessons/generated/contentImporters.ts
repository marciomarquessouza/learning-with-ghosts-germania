import { ContentImporters } from "@/server/types";

// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: node scripts/generate-content-importers.mjs

const generatedContentImporters = {
  "en-UK": {
    "A1-1": {
      "1": {
        "audio": () => import("../content/en-UK/A1-1/days/day_01/audio.json"),
        "lesson": () => import("../content/en-UK/A1-1/days/day_01/lesson.json"),
        "locales": {
          "pt-BR": () => import("../content/en-UK/A1-1/days/day_01/locales/pt-BR.json"),
        },
      },
    },
  },
  "de-DE": {
    "A1-1": {
      "1": {
        "audio": () => import("../content/de-DE/A1-1/days/day_01/audio.json"),
        "lesson": () => import("../content/de-DE/A1-1/days/day_01/lesson.json"),
        "locales": {
          "en-UK": () => import("../content/de-DE/A1-1/days/day_01/locales/en-UK.json"),
          "pt-BR": () => import("../content/de-DE/A1-1/days/day_01/locales/pt-BR.json"),
        },
      },
    },
  },
} satisfies ContentImporters;

export const contentImporters: ContentImporters = generatedContentImporters;
