// app/allotjaments/page.tsx

import Image from "next/image";
import Link from "next/link";
import { allotjaments } from "@/data/allotjaments";

export default function AllotjamentsPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      {/* HERO superior amb foto i text */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src="/hero-priorat.jpg"
          alt="Paisatge del Priorat"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-12">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Allotjaments al Priorat
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-200 md:text-base">
            Cases rurals, hotels amb encant i llocs únics per dormir entre
            vinyes i muntanya.
          </p>
        </div>
      </section>

      {/* GRID d'allotjaments */}
      <section className="px-6 py-10 md:px-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allotjaments.map((item) => {
            // triem la unitat més econòmica per ensenyar "Des de XX€"
            const cheapestUnit = [...item.units].sort(
              (a, b) => a.pricePerNight - b.pricePerNight
            )[0];

            return (
              <Link
                key={item.slug}
                href={`/allotjaments/${item.slug}`}
                className="group rounded-xl bg-neutral-800 shadow-md ring-1 ring-neutral-700 transition hover:ring-neutral-400 overflow-hidden"
              >
                {/* imatge de portada */}
                <div className="relative h-40 w-full">
                  <Image
                    src={item.coverImage}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-sm font-normal text-neutral-400">
                      {item.tipus} · {item.poble}
                    </span>
                  </h2>

                  {cheapestUnit && (
                    <p className="mt-2 text-sm text-neutral-300">
                      Des de{" "}
                      <span className="font-semibold text-white">
                        {cheapestUnit.pricePerNight}€
                      </span>{" "}
                      / nit · fins a {cheapestUnit.capacity} persones
                    </p>
                  )}

                  <p className="mt-3 text-xs text-neutral-400">
                    {item.descripcioLlarga}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

