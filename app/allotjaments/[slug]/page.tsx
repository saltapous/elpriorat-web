// app/allotjaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function AllotjamentDetallPage({ params }: PageProps) {
  const { slug } = params;

  const supabase = await supabaseServerReadOnly();

  // 1) Agafem l'allotjament per slug
  const { data: accommodation, error } = await supabase
    .from("accommodations")
    .select(
      `
      id,
      slug,
      name,
      description,
      capacity,
      base_price,
      type,
      services,
      house_rules,
      establishment_id,
      is_active,
      status,
      created_at
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[/allotjaments/[slug]] supabase error:", error);
  }

  // Si no existeix o no està actiu, 404
  if (!accommodation || accommodation.is_active === false) {
    return notFound();
  }

  // 2) Agafem l'establiment pare (per poble, regió, telèfon...)
  let establishment = null;
  if (accommodation.establishment_id) {
    const { data: estData } = await supabase
      .from("establishments")
      .select(
        `
        id,
        name,
        description,
        address,
        town,
        region,
        phone,
        email,
        website,
        slug
      `
      )
      .eq("id", accommodation.establishment_id)
      .maybeSingle();

    establishment = estData;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* BARRA SUPERIOR + tornada */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/allotjaments"
              className="text-sm text-neutral-300 hover:text-white transition"
            >
              ← Tornar als allotjaments
            </Link>
            <span className="text-sm text-neutral-500">
              {establishment?.town ? establishment.town : "Priorat"}
            </span>
          </div>
          {establishment?.website ? (
            <a
              href={establishment.website}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-amber-300 hover:text-amber-200"
            >
              Web de l’establiment →
            </a>
          ) : null}
        </div>
      </header>

      {/* CONTINGUT */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Columna principal */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-amber-200/80 mb-1">
              {accommodation.type ? accommodation.type : "Allotjament"}
            </p>
            <h1 className="text-3xl font-semibold mb-2">{accommodation.name}</h1>
            <p className="text-sm text-neutral-400">
              {establishment?.town ? establishment.town : ""}
              {establishment?.region ? ` · ${establishment.region}` : ""}
            </p>
          </div>

          {/* Descripció */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <h2 className="text-lg font-medium mb-2">Descripció</h2>
            <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
              {accommodation.description
                ? accommodation.description
                : "Aquest allotjament encara no té una descripció detallada."}
            </p>
          </div>

          {/* Serveis (ve en jsonb) */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <h2 className="text-lg font-medium mb-3">Serveis</h2>
            {Array.isArray(accommodation.services) &&
            accommodation.services.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {accommodation.services.map((srv: string) => (
                  <li
                    key={srv}
                    className="text-xs bg-neutral-800 px-3 py-1 rounded-full text-neutral-100"
                  >
                    {srv}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">
                Encara no s’han afegit serveis.
              </p>
            )}
          </div>

          {/* Normes de la casa */}
          {accommodation.house_rules ? (
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
              <h2 className="text-lg font-medium mb-2">Normes de la casa</h2>
              <p className="text-sm text-neutral-200 whitespace-pre-line">
                {accommodation.house_rules}
              </p>
            </div>
          ) : null}

          {/* Info de l’establiment */}
          {establishment ? (
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
              <h2 className="text-lg font-medium mb-2">Establiment</h2>
              <p className="text-sm text-neutral-100 mb-1">
                {establishment.name}
              </p>
              {establishment.address ? (
                <p className="text-sm text-neutral-400">{establishment.address}</p>
              ) : null}
              <p className="text-sm text-neutral-400">
                {establishment.town ? establishment.town : ""}
                {establishment.region ? ` · ${establishment.region}` : ""}
              </p>
              <div className="mt-3 flex gap-3 text-sm text-neutral-300">
                {establishment.phone ? <span>📞 {establishment.phone}</span> : null}
                {establishment.email ? <span>✉️ {establishment.email}</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Columna lateral (preu, capacitat, estat) */}
        <aside className="w-full md:w-72 space-y-4">
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-neutral-400 mb-1">Preu base</p>
            {accommodation.base_price ? (
              <p className="text-2xl font-semibold text-amber-300">
                {accommodation.base_price} €
                <span className="text-xs text-neutral-400 ml-1">/ nit</span>
              </p>
            ) : (
              <p className="text-sm text-neutral-400">A consultar</p>
            )}
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-medium mb-2">Capacitat</h3>
            <p className="text-sm text-neutral-200">
              {accommodation.capacity
                ? `${accommodation.capacity} persones`
                : "No especificada"}
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-medium mb-2">Estat</h3>
            <p className="text-sm">
              {accommodation.status ? accommodation.status : "actiu"}
            </p>
          </div>

          {/* Placeholder per al futur calendari / botó */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
            <p className="text-sm text-neutral-400 mb-2">
              Calendari i reserves vindran aquí.
            </p>
            <button
              className="w-full bg-amber-400 text-neutral-900 font-medium py-2 rounded-lg hover:bg-amber-300 transition"
              disabled
            >
              Reservar (properament)
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}



