import { getSupabaseServerClient } from "@/lib/supabaseClient";
import Image from "next/image";

type Allotjament = {
  id: number;
  nom: string;
  slug: string;
  tipus: string;
  poble: string;
  capacitat_persones: number;
  preu_base_nit: number;
  descripcio_curta: string | null;
  descripcio_llarga: string | null;
  foto_portada_url: string | null;
  latitud: number | null;
  longitud: number | null;
  creat_el: string;
  actualitzat_el: string;
};

export const revalidate = 0;

export default async function AllotjamentPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
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
        "descripcio_curta",
        "descripcio_llarga",
        "foto_portada_url",
        "latitud",
        "longitud",
        "creat_el",
        "actualitzat_el",
      ].join(", ")
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error carregant allotjament:", error);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-white mb-4">
          Allotjament no trobat
        </h1>
        <p className="text-neutral-400">
          No hem trobat cap allotjament amb aquest nom.
        </p>
      </main>
    );
  }

  const item = data as Allotjament;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Enrere */}
      <a
        href="/allotjaments"
        className="inline-block mb-6 text-sm text-neutral-400 hover:text-white"
      >
        ← Tornar a tots els allotjaments
      </a>

      {/* Capçalera */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white">{item.nom}</h1>
        <p className="text-neutral-400 mt-2">
          {item.tipus} · {item.capacitat_persones} places · {item.poble}
        </p>
      </header>

      {/* Imatge principal */}
      {item.foto_portada_url && (
        <div className="relative w-full h-64 md:h-96 mb-8 overflow-hidden rounded-2xl border border-neutral-800">
          <Image
            src={item.foto_portada_url}
            alt={item.nom}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Descripció llarga */}
      <section className="prose prose-invert max-w-none mb-10">
        {item.descripcio_llarga ? (
          <p className="whitespace-pre-line">{item.descripcio_llarga}</p>
        ) : item.descripcio_curta ? (
          <p>{item.descripcio_curta}</p>
        ) : (
          <p className="text-neutral-400">
            Aviat afegirem més informació sobre aquest allotjament.
          </p>
        )}
      </section>

      {/* Bloc info pràctica / reserva */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-white mb-2">
          Reserva i preus
        </h2>
        <p className="text-neutral-400 mb-2">
          Preu base per nit:{" "}
          <span className="text-white font-medium">
            {item.preu_base_nit} €
          </span>
        </p>
        <p className="text-neutral-500 text-sm mb-4">
          (preus reals poden variar segons temporada i ocupació)
        </p>
        <button className="bg-white text-black font-medium rounded-lg px-4 py-2 hover:bg-neutral-200 transition">
          Consultar disponibilitat
        </button>
      </section>

      {/* Localització si tenim lat/long */}
      {(item.latitud !== null && item.longitud !== null) && (
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-white mb-2">
            On és
          </h2>
          <p className="mb-2">
            {item.poble} (Priorat)
          </p>
          <p className="text-neutral-500">
            Coordenades aproximades: {item.latitud}, {item.longitud}
          </p>
          {/* Aquí més endavant incrustarem un mapa amb Leaflet / Google Maps */}
        </section>
      )}
    </main>
  );
}




