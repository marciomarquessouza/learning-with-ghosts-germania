import { useMemo } from "react";
import { ACTORS, DIALOGUE_MAP } from "@/constants/game";
import { getCharacterDetails } from "@/utils/getCharacterDetails";

export interface CharacterDetails {
  characterName: string;
  avatarURL: string;
  hasHonorific: boolean;
  honorific: string;
}

export const useCharacterDetails = (
  character?: ACTORS | null,
): CharacterDetails => {
  return useMemo(() => getCharacterDetails(character), [character]);
};
