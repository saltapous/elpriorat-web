// app/allotjaments/[slug]/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicListingPage({ params }: Props) {
  // 0️⃣ 👉 amb Next 15 alguns params venen com a async
  const { slug } = await params;

  // 1️⃣ Supabase en mode només lectura
  const supabase = await supabaseServerReadOnly();

  // 2️⃣ Busquem l’allotjament pel seu slug + establiment pare
  const { data: listing, error } = await supabase
    .from("accommodations")
    .select(
      `
      id,
      name,
      slug,
      base_price,
      services,
      status,
      cover_image,
      establishments (
        town,
        region
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  // 3️⃣ Si hi ha error
  if (error) {
    return (
      <main className="min-h-screen bg-rose-50 text-rose-900 p-8">
        <h1 className="text-xl font-semibold mb-4">
          Error carregant allotjament
        </h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  // 4️⃣ Si no hi ha allotjament
  if (!listing) {
    return (
      <main className="min-h-screen flex items-center justify-center text-neutral-500">
        <p>No s’ha trobat aquest allotjament.</p>
      </main>
    );
  }

  // 5️⃣ Dades derivades
  const town = listing.establishments?.town ?? "Priorat";
  const region = listing.establishments?.region ?? "";

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center py-10">
      <article className="w-full max-w-3xl rounded-2xl shadow bg-white overflow-hidden">
        {/* Imatge */}
        <div className="aspect-[16/9] bg-neutral-200 flex items-center justify-center">
          {listing.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.cover_image}
              alt={listing.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-neutral-500 text-sm">Sense imatge</span>
          )}
        </div>

        {/* Contingut */}
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-semibold">{listing.name}</h1>
          <p className="text-neutral-600">
            {town}
            {region ? ` · ${region}` : ""}
          </p>
          <p className="text-lg font-medium text-sky-700">
            {listing.base_price
              ? `${listing.base_price} € / nit`
              : "Preu a consultar"}
          </p>

          {listing.services && listing.services.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-4 text-sm text-neutral-500">
              {listing.services.map((s: string, i: number) => (
                <li key={i} className="bg-neutral-100 px-2 py-1 rounded">
                  {s}
                </li>
              ))}
            </ul>
          )}

          {listing.status && (
            <p className="text-xs uppercase text-neutral-400 pt-3">
              estat: {listing.status}
            </p>
          )}
        </div>
      </article>
    </main>
  );
}


