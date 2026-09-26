"use client";
import { Language } from "@/schemas/language";
import { PlayerLanguageItem } from "./PlayerLanguageItem";
import { Carousel } from "@/components/Carousel";

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
    <Carousel desktopGrid="lg:grid-cols-3" ariaLabel="Language selector">
      {languages.map((language) => (
        <Carousel.Item key={language}>
          <PlayerLanguageItem
            language={language}
            selected={selectedLanguage === language}
            onSelected={onSelected}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
