"use client";
import { useRouter } from "next/navigation";
import { ChallengeSelector } from "@/components/Register/challenge/ChallengeSelector";
import { Language } from "@/constants/lesson";
import { PageTransition } from "../PageTransition";
import { useLessonStore } from "@/store/lessonStore";
import { usePageTransition } from "../PageTransition/usePageTransition";
import { FooterNavigation } from "./common/FooterNavigation";

interface ChallengeProps {
  languages: Language[];
}

export function Challenge({ languages }: ChallengeProps) {
  const router = useRouter();
  const { nextPath, setNextPath, isTransitioning } = usePageTransition();
  const { lessonLanguage, setLessonLanguage } = useLessonStore();

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
              Select the language you want to learn.
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

          <FooterNavigation
            disabled={isTransitioning || !lessonLanguage}
            onClickBack={() => setNextPath("/")}
            onClickNext={() => setNextPath("/register/player-language")}
          />
        </div>
      </main>
    </>
  );
}
