import { ACTORS, GAME_SCENES, GAME_WORLDS, MOODS } from "@/constants/game";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { Jailer } from "@/game/actors/jailer/Jailer";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { Player } from "@/game/actors/player/Player";
import { Punisher } from "@/game/actors/punisher/Punisher";
import { Dialogues } from "@/libs/dialogues/types";
import { Lesson } from "@/libs/lesson/types";

export type GameScenes = (typeof GAME_SCENES)[keyof typeof GAME_SCENES];
export type GameWorlds = (typeof GAME_WORLDS)[keyof typeof GAME_WORLDS];

export type ChallengeCommand = "attack" | "coal";

export type GameActors = {
  [ACTORS.PLAYER]: Player;
  [ACTORS.TUTOR]: Tutor;
  [ACTORS.LEARNING_NODE]: LearningNode;
  [ACTORS.PUNISHER]: Punisher;
  [ACTORS.JAILER]: Jailer;
};

export type CharacterMood = {
  character: ACTORS;
  mood: MOODS;
};

export type DayContent = {
  lesson: Lesson;
  dialogues: Dialogues;
};

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };
