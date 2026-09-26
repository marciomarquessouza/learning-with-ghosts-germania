import { z } from "zod";

import { ACTORS, MOODS } from "@/constants/game";

export const CharacterSchema = z.enum([
  ACTORS.JAILER,
  ACTORS.TUTOR,
  ACTORS.PLAYER,
  ACTORS.PUNISHER,
  ACTORS.LEARNING_NODE,
  ACTORS.GUARDIAN,
]);

export type Character = z.infer<typeof CharacterSchema>;

export const MoodSchema = z.enum([
  MOODS.NEUTRAL,
  MOODS.TALKING,
  MOODS.SAD,
  MOODS.ANGRY,
  MOODS.HAPPY,
  MOODS.SURPRISED,
  MOODS.FLUSHED,
]);

export type Mood = z.infer<typeof MoodSchema>;

export const CharacterMoodSchema = z.object({
  character: CharacterSchema,
  mood: MoodSchema,
});

export type CharacterMood = z.infer<typeof CharacterMoodSchema>;

import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";

export const GameSceneSchema = z.enum([
  GAME_SCENES.CELL_SCENE,
  GAME_SCENES.DREAM_SCENE,
  GAME_SCENES.TRAIN_SCENE,
]);

export type GameScene = z.infer<typeof GameSceneSchema>;

export const GameWorldSchema = z.enum([GAME_WORLDS.REAL, GAME_WORLDS.DREAM]);

export type GameWorld = z.infer<typeof GameWorldSchema>;
