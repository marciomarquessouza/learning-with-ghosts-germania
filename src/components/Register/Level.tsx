"use client";
import { useRouter } from "next/navigation";
import { useLessonStore } from "@/store/lessonStore";
import { usePageTransition } from "../PageTransition/usePageTransition";
import { FooterNavigation } from "./components/FooterNavigation";
import { PageTransition } from "../PageTransition";
import { LevelSelector } from "./components/LevelSelector";
import { AVAILABLE_LEVELS } from "./data/register-data";

export function Level() {
  const router = useRouter();
  const { nextPath, setNextPath, isTransitioning } = usePageTransition();
  const { lessonLanguage, level, setLevel } = useLessonStore();

  return (
    <>
      <PageTransition
        active={nextPath !== null}
        onComplete={() => {
          if (nextPath) {
            router.push(nextPath);
          }
        }}
      />
      <main
        className={[
          "flex w-full flex-col px-6 pt-2 md:pt-16 md:px-16",
          "landscape-short:pt-0",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[872px]">
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

          <FooterNavigation
            disabled={isTransitioning || !lessonLanguage}
            onNavigate={(path) => setNextPath(path)}
          />
        </div>
      </main>
    </>
  );
}
