import { useMemo } from "react";
import { CHARACTERS, DIALOGUE_MAP } from "@/constants/game";

export const useCharacterDetails = (character: CHARACTERS | null) => {
  return useMemo(() => {
    if (!character) return null;

    return {
      characterName: !!character ? DIALOGUE_MAP[character].displayName : "",
      avatarURL: !!character ? DIALOGUE_MAP[character].avatar : "",
      hasHonorific: !!character && !!DIALOGUE_MAP[character]?.honorific,
      honorific: !!character ? DIALOGUE_MAP[character]?.honorific || "" : "",
    };
  }, [character]);
};
