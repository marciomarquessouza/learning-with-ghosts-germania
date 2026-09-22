"use client";
import { Language } from "@/constants/lesson";
import { PlayerLanguageItem } from "./PlayerLanguageItem";

interface PlayerLanguageSelectorProps {
  selectedLanguage: Language;
  onSelected: (language: Language) => void;
}

const languages: Language[] = ["en-UK", "pt-BR", "es-ES"];

export function PlayerLanguageSelector({
  selectedLanguage,
  onSelected,
}: PlayerLanguageSelectorProps) {
  return (
    <div
      className={[
        "flex w-full gap-4 overflow-x-auto px-[7.5%]",
        "snap-x snap-mandatory",
        "scroll-smooth",
        "pb-2",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      ].join(" ")}
    >
      {languages.map((language) => (
        <div
          key={language}
          className={[
            "shrink-0 snap-center",
            "w-[85%]",
            "sm:w-[45%]",
            "lg:w-[31%]",
          ].join(" ")}
        >
          <PlayerLanguageItem
            language={language}
            selected={selectedLanguage === language}
            onSelected={onSelected}
          />
        </div>
      ))}
    </div>
  );
}
