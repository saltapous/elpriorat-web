export default function AllotjamentsPage() {
  // Això després vindrà de la base de dades.
  // Ara ho deixem hardcoded com a demo.
  const allotjaments = [
    {
      name: "Casa del Montsant",
      slug: "casa-del-montsant",
      tipus: "Casa rural",
      persones: 4,
      preu: 140,
      poble: "La Morera de Montsant",
    },
    // Més allotjaments en el futur...
  ];

  return (
    <main
      className="
        relative
        min-h-screen
        text-neutral-100
        bg-neutral-950
        bg-[url('/hero-priorat.jpg')]
        bg-cover
        bg-center
      "
    >
      {/* capa fosca al damunt de la foto per fer contrast */}
      <div className="absolute inset-0 bg-black/70" />

      {/* contingut */}
      <section className="relative px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">
          Allotjaments al Priorat
        </h1>

        <p className="text-neutral-300 mb-8 max-w-xl">
          Cases rurals legals, hotels tranquils i càmpings petits. Reserva
          directament amb la gent del territori, sense intermediaris grans.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allotjaments.map((item) => (
            <a
              key={item.slug}
              href={`/allotjaments/${item.slug}`}
              className="
                block rounded-2xl border border-neutral-800/60
                bg-neutral-900/70 backdrop-blur-sm
                p-5
                hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/10
                transition
              "
            >
              {/* FOTO PLACEHOLDER */}
              <div className="aspect-[4/3] w-full rounded-xl bg-neutral-800/60 mb-4 flex items-center justify-center text-neutral-400 text-sm">
                FOTO
              </div>

              {/* Títol i preu */}
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-medium">{item.name}</h2>
                <span className="text-emerald-400 font-semibold">
                  {item.preu}€ / nit
                </span>
              </div>

              {/* Localització i capacitat */}
              <p className="text-sm text-neutral-300">
                {item.poble} ·{" "}
                {item.persones
                  ? `${item.persones} places`
                  : item.tipus === "Càmping"
                  ? "parcel·les"
                  : "capacitat variable"}
              </p>

              {/* Tipus d'allotjament */}
              <p className="text-xs text-neutral-400 mt-1">
                {item.tipus}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
