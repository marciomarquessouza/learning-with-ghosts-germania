"use client";
import { Language, LESSON_CHALLENGE_DETAILS } from "@/constants/lesson";
import { ChallengeItem } from "./ChallengeItem";
import { useState } from "react";

interface ChallengeSelectorProps {
  languages: Language[];
}

export function ChallengeSelector({ languages }: ChallengeSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<
    Language | undefined
  >(languages[0]);

  const challenges = languages
    .map((language) => LESSON_CHALLENGE_DETAILS[language])
    .filter((value) => value !== undefined);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeItem
          key={challenge.language}
          selected={selectedLanguage === challenge.language}
          challenge={challenge}
          onSelected={setSelectedLanguage}
        />
      ))}
    </div>
  );
}
