"use client";
import { useRouter } from "next/navigation";
import { PageTransition } from "../PageTransition";
import { usePageTransition } from "../PageTransition/usePageTransition";
import { FooterNavigation } from "./common/FooterNavigation";

export function PlayerLanguage() {
  const router = useRouter();
  const { nextPath, setNextPath, isTransitioning } = usePageTransition();

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
              What language do you speak?
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
            Language Selector
          </section>

          <FooterNavigation
            disabled={isTransitioning}
            onClickBack={() => setNextPath("/register/challenge")}
            onClickNext={() => setNextPath("/register/level")}
          />
        </div>
      </main>
    </>
  );
}
