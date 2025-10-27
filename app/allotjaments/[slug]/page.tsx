// app/allotjaments/[slug]/page.tsx

// app/allotjaments/[slug]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import { allotjaments } from "@/data/allotjaments";

type Props = {
  params: {
    slug: string;
  };
};

export default async function AllotjamentDetallPage({ params }: Props) {
  const { slug } = params; // agafem el slug de la URL

  const hotel = allotjaments.find((a) => a.slug === slug);

  if (!hotel) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      {/* HERO gran amb foto i nom */}
      <section className="relative h-72 w-full overflow-hidden md:h-96">
        <Image
          src={hotel.coverImage}
          alt={hotel.name}
          fill
          className="object-cover opacity-40"
          priority
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-end bg-gradient-to-t from-neutral-900/80 to-transparent px-6 pb-6 md:px-12 md:pb-10">
          <h1 className="text-3xl font-semibold md:text-4xl">{hotel.name}</h1>
          <p className="mt-2 text-sm text-neutral-200 md:text-base">
            {hotel.tipus} · {hotel.poble}
          </p>
        </div>
      </section>

      {/* DESCRIPCIÓ + UNITATS */}
      <section className="px-6 py-10 md:px-12">
        {/* descripció llarga */}
        <div className="max-w-4xl">
          <p className="text-neutral-300 text-sm leading-relaxed md:text-base">
            {hotel.descripcioLlarga}
          </p>
        </div>

        <h2 className="mt-10 text-xl font-semibold text-white md:text-2xl">
          Allotjaments disponibles
        </h2>
        <p className="text-neutral-400 text-sm mt-1">
          Tria habitació, casa sencera o bungalow.
        </p>

        {/* llista de unitats */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {hotel.units.map((u) => (
            <div
              key={u.id}
              className="rounded-xl bg-neutral-800 ring-1 ring-neutral-700 shadow-md overflow-hidden flex flex-col"
            >
              {/* imatge unitat */}
              <div className="relative h-40 w-full">
                <Image
                  src={u.images[0] || "/hero-priorat.jpg"}
                  alt={u.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* cos targeta */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {u.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      {u.shortDescription}
                    </p>
                  </div>

                  {/* preu */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white leading-none">
                      {u.pricePerNight}€
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-none">
                      / nit
                    </div>
                  </div>
                </div>

                {/* etiquetes */}
                <div className="mt-3 flex flex-wrap text-[12px] text-neutral-300 gap-3">
                  <span className="rounded-lg bg-neutral-700/60 px-2 py-1">
                    {u.capacity} persones
                  </span>

                  <span
                    className={`rounded-lg px-2 py-1 ${
                      u.available
                        ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                        : "bg-red-600/20 text-red-400 ring-1 ring-red-600/40"
                    }`}
                  >
                    {u.available ? "Disponible" : "Ara ocupat"}
                  </span>
                </div>

                {/* calendari placeholder */}
                <div className="mt-4 rounded-lg bg-neutral-900/40 p-3 text-[12px] text-neutral-400 ring-1 ring-neutral-700/60">
                  Calendari d'ocupació (proper pas)
                </div>

                {/* botó reservar */}
                <button
                  disabled={!u.available}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium ${
                    u.available
                      ? "bg-white text-neutral-900 hover:bg-neutral-200 transition"
                      : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {u.available ? "Reservar" : "No disponible ara mateix"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
