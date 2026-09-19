import { ChallengeSelector } from "@/components/Register/ChallengeSelector";
import { getRegisterOptions } from "@/server/lessons/services/getRegisterOptions";

export default async function Challenge() {
  const { lessonLanguages } = getRegisterOptions();

  return (
    <main className="flex w-full flex-col px-6 pt-16 md:px-16 lg:px-0">
      <div className="w-full max-w-[872px] lg:ml-[14%]">
        <header>
          <h1 className="font-staatliches text-5xl md:text-6xl">
            I WANT TO LEARN...
          </h1>

          <p className="mt-5 font-mono text-sm text-[#8A8378] md:text-base">
            Select the language for your challenge.
          </p>
        </header>

        <section className="mt-14">
          <ChallengeSelector languages={lessonLanguages} />
        </section>

        <footer className="mt-12 flex items-center gap-6">
          <button
            type="button"
            className="
              flex h-16 min-w-[164px] items-center justify-center gap-2
              rounded-md bg-[#FF1F26] px-8
              font-staatliches text-2xl text-white
              transition-colors hover:bg-[#E71920]
            "
          >
            NEXT
            <span aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            disabled
            className="
              cursor-not-allowed font-mono text-sm
              text-[#8A8378] opacity-70
            "
          >
            ...I already have an account
          </button>
        </footer>
      </div>
    </main>
  );
}
