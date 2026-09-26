import { Dialogues } from "@/libs/dialogues/types";
import { Language } from "@/schemas/language";
import { Lesson } from "@/schemas/lesson";
import { Level } from "@/schemas/level";

export interface LessonOptions {
  day: number;
  lessonLanguage: Language;
  playerLanguage: Language;
  level: Level;
}

export type JsonImporter = () => Promise<{ default: unknown }>;

export type DayContentImporters = {
  lesson: JsonImporter;
  audio: JsonImporter;
  locales: Partial<Record<Language, JsonImporter>>;
};

export type DayContent = {
  lesson: Lesson;
  dialogues: Dialogues;
};

export type LevelContentImporters = Record<number, DayContentImporters>;

export type LanguageContentImporters = Partial<
  Record<Level, LevelContentImporters>
>;

export type ContentImporters = Partial<
  Record<Language, LanguageContentImporters>
>;

export interface DeepgramTranscriptionResponse {
  metadata: {
    transaction_key: string;
    request_id: string;
    sha256: string;
    created: string;
    duration: number;
    channels: number;
    models: string[];
    model_info: Record<
      string,
      {
        name: string;
        version: string;
        arch: string;
      }
    >;
  };
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
          punctuated_word: string;
        }>;
        paragraphs: {
          transcript: string;
          paragraphs: Array<{
            sentences: Array<{
              text: string;
              start: number;
              end: number;
            }>;
            num_words: number;
            start: number;
            end: number;
          }>;
        };
      }>;
    }>;
  };
}
