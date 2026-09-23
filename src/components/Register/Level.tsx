"use client";
import { useLessonStore } from "@/store/lessonStore";
import { LevelSelector } from "./components/LevelSelector";
import { AVAILABLE_LEVELS } from "./data/register-data";
import { RegisterPageLayout } from "./layout/RegisterPageLayout";

export function Level() {
  const { lessonLanguage, level, setLevel } = useLessonStore();

  return (
    <RegisterPageLayout>
      <header>
        <h1 className="font-staatliches text-5xl md:text-6xl">
          CHOOSE YOUR LEVEL...
        </h1>

        <p
          className={[
            "mt-5 font-mono text-sm text-[#8A8378] md:text-base",
            "landscape-short:mt-0",
          ].join(" ")}
        >
          Select the level for your challenge.
        </p>
      </header>

      <section className={["mt-6", "landscape-short:mt-0"].join(" ")}>
        <LevelSelector
          levels={AVAILABLE_LEVELS[lessonLanguage] ?? []}
          selectedLevel={level}
          onSelected={setLevel}
        />
      </section>
    </RegisterPageLayout>
  );
}
