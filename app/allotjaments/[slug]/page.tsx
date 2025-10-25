import ReservaForm from "./ReservaForm";

export default function AllotjamentPage() {
  // això també pot venir de BD segons el slug
  const dadesAllotjament = {
    name: "Casa del Montsant",
    poble: "La Morera de Montsant",
    preu: 140,
    maxPlaces: 4,
    descripcio:
      "Casa rural al cor del Montsant. Silenci, foscor real a la nit i esmorzar amb oli del poble.",
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 bg-[url('/hero-priorat.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/70" />

      <section className="relative px-6 py-12 max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-semibold mb-2">
            {dadesAllotjament.name}
          </h1>
          <p className="text-neutral-300 text-sm">
            {dadesAllotjament.poble} · {dadesAllotjament.maxPlaces} places ·{" "}
            <span className="text-emerald-400 font-semibold">
              {dadesAllotjament.preu}€ / nit
            </span>
          </p>
        </header>

        <p className="text-neutral-400 leading-relaxed">
          {dadesAllotjament.descripcio}
        </p>

        {/* Aquí sí que posem el formulari client */}
        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-2xl border border-neutral-800/60 p-6">
          <h2 className="text-lg font-medium mb-4">
            Sol·licita disponibilitat
          </h2>
          <ReservaForm maxPlaces={dadesAllotjament.maxPlaces} />
        </div>
      </section>
    </main>
  );
}

