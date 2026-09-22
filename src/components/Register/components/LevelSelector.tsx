"use client";
import { Level } from "@/constants/lesson";
import { LevelItem } from "./LevelItem";

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
    <div
      className={[
        // Mobile / Tablet: carousel
        "flex w-full gap-0 overflow-x-auto",
        "snap-x snap-mandatory scroll-smooth",
        "pb-2",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",

        // Desktop: grid
        "lg:grid lg:grid-cols-3",
        "lg:overflow-visible lg:snap-none",
      ].join(" ")}
    >
      {levels.map((level) => (
        <div
          key={level}
          className={[
            // Carousel
            "w-[85%] shrink-0 snap-center",
            "sm:w-[45%]",

            // Grid
            "lg:w-auto lg:shrink lg:snap-align-none",
          ].join(" ")}
        >
          <LevelItem
            selected={selectedLevel === level}
            level={level}
            onSelected={onSelected}
          />
        </div>
      ))}
    </div>
  );
}
