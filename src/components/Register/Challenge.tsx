"use client";
import { useRouter } from "next/navigation";
import { ChallengeSelector } from "@/components/Register/challenge/ChallengeSelector";
import { Language } from "@/constants/lesson";
import { PageTransition } from "../PageTransition";
import { useState } from "react";
import { useLessonStore } from "@/store/lessonStore";

interface ChallengeProps {
  languages: Language[];
}

export function Challenge({ languages }: ChallengeProps) {
  const router = useRouter();
  const [nextPath, setNextPath] = useState<string | null>(null);
  const { lessonLanguage, setLessonLanguage } = useLessonStore();
  const isTransitioning = nextPath !== null;

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
              I WANT TO LEARN...
            </h1>

            <p
              className={[
                "mt-5 font-mono text-sm text-[#8A8378] md:text-base",
                "landscape-short:mt-0",
              ].join(" ")}
            >
              Select the language for your challenge.
            </p>
          </header>

          <section
            className={["mt-6 md:mt-14", "landscape-short:mt-0"].join(" ")}
          >
            <ChallengeSelector
              languages={languages}
              selectedLanguage={lessonLanguage}
              onSelected={setLessonLanguage}
            />
          </section>

          <footer
            className={[
              "mt-12 flex items-center gap-6",
              "landscape-short:mt-6",
            ].join(" ")}
          >
            <button
              id="back"
              type="button"
              disabled={isTransitioning}
              onClick={() => setNextPath("/")}
              className={[
                "flex h-16 min-w-[64px] items-center justify-center gap-2",
                "rounded-md bg-[#FF1F26] px-8",
                "font-staatliches text-4xl text-white",
                "transition-colors hover:bg-[#E71920]",
              ].join(" ")}
            >
              ⏴
            </button>

            <button
              type="button"
              disabled={isTransitioning}
              onClick={() => setNextPath("/register/player-language")}
              className={[
                "flex h-16 min-w-[164px] items-center justify-center gap-2",
                "rounded-md bg-[#FF1F26] px-8",
                "font-staatliches text-2xl text-white",
                "transition-colors hover:bg-[#E71920]",
              ].join(" ")}
            >
              NEXT
              <span className="text-4xl" aria-hidden="true">
                ▸
              </span>
            </button>

            <button
              type="button"
              disabled
              className={[
                "cursor-not-allowed font-mono text-sm",
                "text-[#8A8378] opacity-70",
              ].join(" ")}
            >
              ...I already have an account
            </button>
          </footer>
        </div>
      </main>
    </>
  );
}
