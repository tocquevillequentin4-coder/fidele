export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center sm:pt-28">
        <h1 className="mx-auto max-w-2xl font-serif text-4xl font-semibold leading-tight text-marine sm:text-5xl">
          Le rappel qui fait revenir vos clients.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-marine/70">
          Fidèle relance automatiquement vos clients au bon moment, pour qu&apos;ils reviennent -- sans que vous ayez à y penser.
        </p>
        <a
          href="#essai"
          className="mt-8 inline-block rounded-full bg-corail px-8 py-4 text-lg font-semibold text-creme transition hover:opacity-90"
        >
          Essayer gratuitement
        </a>
      </section>

      {/* Douleur */}
      <section className="border-y border-marine/10 bg-marine/5 px-6 py-14 text-center">
        <p className="mx-auto max-w-xl font-serif text-2xl text-marine sm:text-3xl">
          Un client satisfait ne revient pas parce qu&apos;il est déçu.
          <br />
          Il revient pas parce qu&apos;il oublie -- et que personne ne le relance.
        </p>
      </section>

      {/* Bénéfices */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-serif text-xl text-marine">Automatique</p>
            <p className="mt-2 text-marine/70">
              Le rappel part tout seul, au bon moment, sans que vous ayez à y penser.
            </p>
          </div>
          <div className="text-center">
            <p className="font-serif text-xl text-marine">Une vraie raison de revenir</p>
            <p className="mt-2 text-marine/70">
              Une offre simple, à usage unique, qui donne envie de repasser la porte.
            </p>
          </div>
          <div className="text-center">
            <p className="font-serif text-xl text-marine">Mesurable</p>
            <p className="mt-2 text-marine/70">
              Vous voyez combien de clients reviennent, et combien ça rapporte.
            </p>
          </div>
        </div>
      </section>

      {/* Preuve sociale */}
      <section className="border-t border-marine/10 px-6 py-14 text-center">
        <p className="text-sm uppercase tracking-widest text-marine/50">
          Ils font déjà confiance à Fidèle
        </p>
        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-8 opacity-40">
          <div className="h-8 w-28 rounded bg-marine/20" />
          <div className="h-8 w-28 rounded bg-marine/20" />
          <div className="h-8 w-28 rounded bg-marine/20" />
        </div>
      </section>

      {/* CTA final */}
      <section id="essai" className="bg-marine px-6 py-20 text-center">
        <h2 className="mx-auto max-w-xl font-serif text-3xl font-semibold text-creme">
          Prêt à faire revenir vos clients ?
        </h2>
        <a
          href="/inscription"
          className="mt-8 inline-block rounded-full bg-corail px-8 py-4 text-lg font-semibold text-creme transition hover:opacity-90"
        >
          Essayer gratuitement
        </a>
      </section>
    </main>
  );
}
