"use client";
import { Language } from "@/constants/lesson";
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
  return (
    <div className="grid grid-cols-1 gap-4 landscape-short:gap-0 sm:grid-cols-2 lg:grid-cols-3">
      {languages.map((language) => (
        <ChallengeItem
          key={language}
          selected={selectedLanguage === language}
          language={language}
          onSelected={onSelected}
        />
      ))}
    </div>
  );
}
