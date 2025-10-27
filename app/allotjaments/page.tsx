import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

type Allotjament = {
  id: number;
  nom: string;
  slug: string;
  tipus: string;
  poble: string;
  capacitat_persones: number;
  preu_base_nit: number;
  foto_portada_url: string | null;
  descripcio_curta: string | null;
};

export const revalidate = 0;

export default async function AllotjamentsPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("allotjaments")
    .select(
      [
        "id",
        "nom",
        "slug",
        "tipus",
        "poble",
        "capacitat_persones",
        "preu_base_nit",
        "foto_portada_url",
        "descripcio_curta",
      ].join(", ")
    )
    .order("nom", { ascending: true });

  if (error) {
    console.error("Error carregant allotjaments:", error);
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-white mb-4">
          Allotjaments
        </h1>
        <p className="text-red-400">
          No s'han pogut carregar els allotjaments ara mateix.
        </p>
      </main>
    );
  }

  const allotjaments = (data || []) as Allotjament[];

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-white">
          Allotjaments al Priorat
        </h1>
        <p className="text-neutral-300 mt-2 text-sm max-w-2xl">
          Cases rurals legals, hotels tranquils i càmpings petits. Reserva
          directament amb la gent del territori, sense intermediaris grans.
        </p>
      </header>

      {/* Cards */}
      <section className="grid gap-6">
        {allotjaments.length === 0 ? (
          <p className="text-neutral-400">
            Encara no hi ha allotjaments disponibles.
          </p>
        ) : (
          allotjaments.map((item) => (
            <article
              key={item.id}
              className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 md:flex md:gap-4 md:items-start shadow-[0_30px_120px_rgba(0,0,0,0.8)]"
            >
              {/* FOTO */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="relative w-full h-48 rounded-lg border border-neutral-800 bg-neutral-900/60 overflow-hidden flex items-center justify-center text-neutral-400 text-sm">
                  {item.foto_portada_url ? (
  item.foto_portada_url.includes("via.placeholder.com") ? (
    // Per URLs que no volem passar per <Image />
    <img
      src={item.foto_portada_url}
      alt={item.nom}
      className="absolute inset-0 w-full h-full object-cover"
    />
  ) : (
    // Per URLs que sí tenim configurades (Supabase)
    <Image
      src={item.foto_portada_url}
      alt={item.nom}
      fill
      className="object-cover"
    />
  )
) : (
  <span className="text-neutral-500">FOTO</span>
)}

                </div>
              </div>

              {/* TEXT */}
              <div className="mt-4 md:mt-0 flex-1">
                {/* Nom + preu */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <a
                    href={`/allotjaments/${item.slug}`}
                    className="text-lg font-semibold text-teal-300 hover:text-teal-200"
                  >
                    {item.nom}
                  </a>

                  <div className="text-white font-semibold text-lg">
                    {item.preu_base_nit}€{" "}
                    <span className="text-neutral-400 text-sm font-normal">
                      / nit
                    </span>
                  </div>
                </div>

                {/* Poble / capacitat */}
                <div className="text-neutral-300 text-sm mt-1">
                  {item.poble} · {item.capacitat_persones} places
                </div>

                {/* Tipus */}
                <div className="text-neutral-500 text-xs mt-2">
                  {item.tipus}
                </div>

                {/* Descripció curta si existeix */}
                {item.descripcio_curta && (
                  <p className="text-neutral-400 text-sm mt-3 line-clamp-3">
                    {item.descripcio_curta}
                  </p>
                )}

                {/* CTA */}
                <div className="mt-4">
                  <a
                    href={`/allotjaments/${item.slug}`}
                    className="inline-block text-sm font-medium text-white bg-neutral-800 border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2"
                  >
                    Veure detalls
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

