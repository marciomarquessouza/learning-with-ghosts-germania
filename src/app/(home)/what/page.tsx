export default function WhatPage() {
  return (
    <div className="p-2">
      <section className="flex flex-1 flex-col justify-center mx-auto">
        <div className="mb-6 h-1 w-16 bg-red-600" />

        <h1 className="text-4xl font-black uppercase tracking-[0.08em] sm:text-6xl">
          What
        </h1>

        <p className="mt-6 max-w-2xl text-sm font-semibold uppercase leading-7 tracking-[0.22em]">
          Learning With Ghosts — Germania is a narrative game to learn German.
          <br />
          You read. You translate. You answer.
          <br />
          German is the core mechanic.
        </p>

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 text-xs font-semibold uppercase tracking-[0.28em]">
          <div className="border border-black/20 p-4">
            Structured lessons (vocabulary + grammar)
          </div>
          <div className="border border-black/20 p-4">
            Choices affect the experience
          </div>
          <div className="border border-black/20 p-4">
            Minimal UI, maximum pressure
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
          Fictional dystopia. Language-learning game.
        </p>
      </section>
    </div>
  );
}
