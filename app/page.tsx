export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* HERO amb imatge local */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/hero-priorat.jpg')",
        }}
      >
        {/* capa fosca per llegibilitat */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-white">
            Benvinguts al Priorat
          </h1>

          <p className="text-lg text-neutral-300 leading-relaxed">
            Guia moderna per descobrir camins, cellers i paisatges.
            Contingut curat, rutes i agenda local.
          </p>

          <a
            href="/allotjaments"
            className="inline-block mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-500 transition"
          >
            Explora allotjaments
          </a>
        </div>
      </section>

      {/* BLOCS PRINCIPALS */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Rutes */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-emerald-600 transition">
          <h2 className="text-emerald-400 text-lg font-semibold mb-2">
            Rutes a peu
          </h2>
          <p className="text-neutral-400 text-sm mb-3">
            GR, camins històrics i senders entre vinyes.
          </p>
          <a
            href="/rutes"
            className="text-emerald-500 text-sm font-medium hover:underline"
          >
            Explora
          </a>
        </div>

        {/* Vins i cellers */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-emerald-600 transition">
          <h2 className="text-emerald-400 text-lg font-semibold mb-2">
            Vins i cellers
          </h2>
          <p className="text-neutral-400 text-sm mb-3">
            DOQ Priorat i DO Montsant: mapes i visites.
          </p>
          <a
            href="/cellers"
            className="text-emerald-500 text-sm font-medium hover:underline"
          >
            Explora
          </a>
        </div>

        {/* Pobles */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-emerald-600 transition">
          <h2 className="text-emerald-400 text-lg font-semibold mb-2">
            Pobles
          </h2>
          <p className="text-neutral-400 text-sm mb-3">
            Fitxes breus: història, què veure i on menjar.
          </p>
          <a
            href="/pobles"
            className="text-emerald-500 text-sm font-medium hover:underline"
          >
            Explora
          </a>
        </div>

        {/* Allotjaments */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-emerald-600 transition">
          <h2 className="text-emerald-400 text-lg font-semibold mb-2">
            Allotjaments
          </h2>
          <p className="text-neutral-400 text-sm mb-3">
            Cases rurals, hotels i càmpings del Priorat.
          </p>
          <a
            href="/allotjaments"
            className="text-emerald-500 text-sm font-medium hover:underline"
          >
            Explora
          </a>
        </div>
      </section>

      {/* PEU DE PÀGINA */}
      <footer className="py-8 text-center text-sm text-neutral-600 border-t border-neutral-800">
        <p>
          © {new Date().getFullYear()} elpriorat.cat — Projecte obert per
          descobrir, compartir i viure el Priorat 🍷
        </p>
      </footer>
    </main>
  );
}






