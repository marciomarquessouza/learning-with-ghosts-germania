import { DIALOGUE_MAP } from "@/constants/game";
import { Character } from "@/libs/dialogues/types";

export interface CharacterDetails {
  characterName: string;
  avatarURL: string;
  hasHonorific: boolean;
  honorific: string;
}

export const getCharacterDetails = (
  character?: Character | null,
): CharacterDetails => {
  return {
    characterName: !!character ? DIALOGUE_MAP[character].displayName : "",
    avatarURL: !!character ? DIALOGUE_MAP[character].avatar : "",
    hasHonorific: !!character && !!DIALOGUE_MAP[character]?.honorific,
    honorific: !!character ? DIALOGUE_MAP[character]?.honorific || "" : "",
  };
};
