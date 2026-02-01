export default function HowMuchPage() {
  return (
    <main className="p-2">
      <section
        className="flex flex-1 flex-col justify-center"
        aria-labelledby="how-much-title"
      >
        <div className="mb-6 h-1 w-16 bg-red-600" aria-hidden="true" />

        <h1
          id="how-much-title"
          className="text-4xl font-black uppercase tracking-[0.08em] sm:text-6xl"
        >
          How Much
        </h1>

        <p className="mt-6 max-w-2xl text-sm font-semibold uppercase leading-7 tracking-[0.22em]">
          Current status: free beta.
          <br />
          No ads. No hidden payments.
        </p>

        <ul className="mt-10 grid max-w-2xl grid-cols-1 gap-3 text-xs font-semibold uppercase tracking-[0.28em]">
          <li className="border border-black/20 p-4">
            Free during development
          </li>
          <li className="border border-black/20 p-4">
            Future: chapters / expansions (optional)
          </li>
          <li className="border border-black/20 p-4">
            Future: advanced AI feedback (optional)
          </li>
        </ul>

        <p className="mt-10 max-w-2xl text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
          The goal is simple: learn German through a game.
        </p>
      </section>
    </main>
  );
}
