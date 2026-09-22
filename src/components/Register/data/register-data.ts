import { Language, Level } from "@/constants/lesson";
import {
  LessonChallengeDetail,
  LevelDetails,
  PlayerLanguageDetails,
} from "../types";

export const LESSON_CHALLENGE_DETAILS: Partial<
  Record<Language, LessonChallengeDetail>
> = {
  "de-DE": {
    language: "de-DE",
    title: "GERMAN",
    nation: "GERMANIA",
    description:
      "Live in GERMANIA, a city-state where not knowing German is a crime",
  },
  "en-US": {
    language: "en-US",
    title: "ENGLISH",
    nation: "BRITANNIA",
    description:
      "Live in BRITANNIA, the empire on which the sun never sets—where not speaking English can cost you your life.",
  },
};

export const PLAYER_LANGUAGE_DETAILS: Partial<PlayerLanguageDetails> = {
  "en-UK": {
    label: "ENGLISH",
    icon: "/ui/flags/flag_en-UK.svg",
  },
  "pt-BR": {
    label: "PORTUGUESE",
    icon: "/ui/flags/flag_pt-BR.svg",
  },
  "es-ES": {
    label: "SPANISH",
    icon: "/ui/flags/flag_es-ES.svg",
  },
};

export const LEVEL_DETAILS: LevelDetails = {
  "A1-1": {
    level: "A1-1",
    label: "First Steps",
    title: "A1.1",
    description: "Learn basic words and simple everyday phrases.",
  },
  "A1-2": {
    level: "A1-2",
    label: "Getting Started",
    title: "A1.2",
    description: "Handle simple conversations about familiar topics.",
  },
  "A2-1": {
    level: "A2-1",
    label: "Everyday Talk",
    title: "A2.1",
    description: "Communicate in common everyday situations.",
  },
  "A2-2": {
    level: "A2-2",
    label: "Building Confidence",
    title: "A2.2",
    description: "Speak with more detail about daily life and experiences.",
  },
  "B1-1": {
    level: "B1-1",
    label: "Going Further",
    title: "B1.1",
    description:
      "Handle conversations about work, travel, and personal interests.",
  },
  "B1-2": {
    level: "B1-2",
    label: "More Independent",
    title: "B1.2",
    description:
      "Express ideas, opinions, and experiences with more confidence.",
  },
  "B2-1": {
    level: "B2-1",
    label: "Speaking Naturally",
    title: "B2.1",
    description: "Discuss complex topics and communicate more spontaneously.",
  },
  "B2-2": {
    level: "B2-2",
    label: "Advanced Conversation",
    title: "B2.2",
    description: "Communicate clearly and naturally in demanding situations.",
  },
};

export const AVAILABLE_LEVELS: Partial<Record<Language, Level[]>> = {
  "de-DE": ["A1-1", "A1-2", "A2-1", "A2-2", "B1-1", "B1-2"],
  "en-UK": ["A1-1"],
};
