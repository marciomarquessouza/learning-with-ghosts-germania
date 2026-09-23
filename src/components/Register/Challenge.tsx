"use client";
import { ChallengeSelector } from "@/components/Register/components/ChallengeSelector";
import { Language } from "@/constants/lesson";
import { useLessonStore } from "@/store/lessonStore";
import { RegisterPageLayout } from "./layout/RegisterPageLayout";

interface ChallengeProps {
  languages: Language[];
}

export function Challenge({ languages }: ChallengeProps) {
  const { lessonLanguage, setLessonLanguage } = useLessonStore();

  return (
    <RegisterPageLayout>
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

      <section className={["mt-6 md:mt-14", "landscape-short:mt-0"].join(" ")}>
        <ChallengeSelector
          languages={languages}
          selectedLanguage={lessonLanguage}
          onSelected={setLessonLanguage}
        />
      </section>
    </RegisterPageLayout>
  );
}
