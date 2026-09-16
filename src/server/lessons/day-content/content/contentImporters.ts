import { Language } from "../../validators/language";
import { Level } from "../../validators/levels";
import { DayImportContent } from "./de-DE/A1-1/dayContentImporters";

export const contentImporters = {
  "de-DE": {
    "A1-1": () => import("./de-DE/A1-1/dayContentImporters"),
  },
  "en-US": {
    "A1-1": () => import("./en-US/A1-1/dayContentImporters"),
  },
} as Record<
  Language,
  Record<Level, () => Promise<{ dayContentImporters: DayImportContent }>>
>;
