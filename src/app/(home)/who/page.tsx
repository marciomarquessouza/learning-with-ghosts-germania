export default function WhoPage() {
  return (
    <main className="p-2">
      <section
        className="flex flex-1 flex-col justify-center mx-auto"
        aria-labelledby="who-title"
      >
        <div className="mb-6 h-1 w-16 bg-red-600" aria-hidden="true" />

        <h1
          id="who-title"
          className="text-4xl font-black uppercase tracking-[0.08em] sm:text-6xl"
        >
          Who
        </h1>

        <p className="mt-6 max-w-2xl text-sm font-semibold uppercase leading-7 tracking-[0.22em]">
          Created by Marcio Marques de Souza.
          <br />
          Frontend developer. Design-focused. Independent project.
        </p>

        <section
          className="mt-10 max-w-2xl border border-black/20 p-5"
          aria-labelledby="statement-title"
        >
          <h2
            id="statement-title"
            className="text-xs font-semibold uppercase tracking-[0.28em] opacity-80"
          >
            Statement
          </h2>

          <p className="mt-4 text-xs font-semibold uppercase leading-6 tracking-[0.24em]">
            This is a fictional work.
            <br />A game about learning German.
          </p>
        </section>

        <p className="mt-10 max-w-2xl text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
          The aesthetic is intentional: a dystopian frame to make language feel
          like structure, pressure, and control.
        </p>
      </section>
    </main>
  );
}
