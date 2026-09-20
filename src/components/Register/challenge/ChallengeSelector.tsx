"use client";
import { Language, LESSON_CHALLENGE_DETAILS } from "@/constants/lesson";
import { ChallengeItem } from "./ChallengeItem";

interface ChallengeSelectorProps {
  selectedLanguage: Language;
  onSelected: (language: Language) => void;
  languages: Language[];
}

export function ChallengeSelector({
  selectedLanguage,
  onSelected,
  languages,
}: ChallengeSelectorProps) {
  const challenges = languages
    .map((language) => LESSON_CHALLENGE_DETAILS[language])
    .filter((value) => value !== undefined);

  return (
    <div className="grid grid-cols-1 gap-4 landscape-short:gap-0 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeItem
          key={challenge.language}
          selected={selectedLanguage === challenge.language}
          challenge={challenge}
          onSelected={onSelected}
        />
      ))}
    </div>
  );
}
