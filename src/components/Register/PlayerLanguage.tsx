"use client";
import { PlayerLanguageSelector } from "./components/PlayerLanguageSelector";
import { useLessonStore } from "@/store/lessonStore";
import { RegisterPageLayout } from "./layout/RegisterPageLayout";

export function PlayerLanguage() {
  const { playerLanguage, setPlayerLanguage } = useLessonStore();

  return (
    <RegisterPageLayout>
      <header>
        <h1 className="font-staatliches text-5xl md:text-6xl">I SPEAK...</h1>

        <p
          className={[
            "mt-5 font-mono text-sm text-[#8A8378] md:text-base",
            "landscape-short:mt-0",
          ].join(" ")}
        >
          Select the language for instructions and lessons.
        </p>
      </header>

      <section className={["mt-6 md:mt-14", "landscape-short:mt-0"].join(" ")}>
        <PlayerLanguageSelector
          selectedLanguage={playerLanguage}
          onSelected={setPlayerLanguage}
        />
      </section>
    </RegisterPageLayout>
  );
}
