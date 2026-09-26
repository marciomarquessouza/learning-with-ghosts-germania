"use client";
import { Level } from "@/schemas/level";
import { LevelItem } from "./LevelItem";
import { Carousel } from "@/components/Carousel";

interface LevelSelectorProps {
  selectedLevel: Level;
  onSelected: (level: Level) => void;
  levels: Level[];
}

export function LevelSelector({
  selectedLevel,
  onSelected,
  levels,
}: LevelSelectorProps) {
  return (
    <Carousel desktopGrid="lg:grid-cols-3" ariaLabel="Level selector">
      {levels.map((level) => (
        <Carousel.Item key={level}>
          <LevelItem
            selected={selectedLevel === level}
            level={level}
            onSelected={onSelected}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
