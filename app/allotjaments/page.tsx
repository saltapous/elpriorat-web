export const dynamic = "force-dynamic";

import { createPublicClient } from "@/lib/supabasePublic";

export default async function PublicListingsPage() {
  const supabase = createPublicClient();

  const { data: listings, error } = await supabase
    .from("accommodations")
    .select(
      `
        id,
        slug,
        name,
        type,
        capacity,
        base_price,
        services,
        establishments!inner (
          town,
          region
        ),
        listing_images (
          path,
          is_cover
        )
      `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // DEBUG SERVER LOG
  console.log("[/allotjaments] error:", error);
  console.log("[/allotjaments] listings:", listings);

  // si hi ha error a la query, mostrem-ho clarament
  if (error) {
    return (
      <main className="min-h-screen bg-red-50 text-red-900 p-8">
        <h1 className="text-xl font-bold mb-4">
          Error carregant allotjaments
        </h1>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </pre>
        <p className="mt-4 text-sm text-red-700">
          Això sol ser un tema de permisos RLS o que la taula no té les
          columnes exactes.
        </p>
      </main>
    );
  }

  // construïm les targetes (cards) igual que abans
  let cards: {
    id: string;
    name: string;
    slug: string;
    coverUrl: string | null;
    town: string | null;
    region: string | null;
    capacity: number | null;
    base_price: number | null;
    type: string | null;
  }[] = [];

  if (listings && listings.length > 0) {
    const storage = supabase.storage.from("listing-images");

    cards = listings.map((l) => {
      const cover =
        l.listing_images?.find((img) => img.is_cover) ||
        l.listing_images?.[0];

      let coverUrl: string | null = null;
      if (cover?.path) {
        const { data: publicUrlData } = storage.getPublicUrl(cover.path);
        coverUrl = publicUrlData.publicUrl;
      }

      return {
        id: l.id,
        name: l.name,
        slug: l.slug,
        town: l.establishments?.town || null,
        region: l.establishments?.region || null,
        capacity: l.capacity ?? null,
        base_price: l.base_price ?? null,
        type: l.type ?? null,
        coverUrl,
      };
    });
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        {/* DEBUG HEADER SEMPRE VISIBLE */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Allotjaments al Priorat (debug)
          </h1>
          <p className="text-neutral-600 text-sm max-w-prose">
            Si veus aquest text, la pàgina s'està renderitzant.
          </p>
        </header>

        {/* cap allotjament publicat? */}
        {(!cards || cards.length === 0) && (
          <p className="text-neutral-500 text-sm">
            Ara mateix no hi ha allotjaments publicats o no n'hi ha cap amb
            status = "published".
          </p>
        )}

        {/* hi ha targetes */}
        {cards && cards.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.id}
                href={`/allotjaments/${card.slug}`}
                className="group rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                  {card.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.coverUrl}
                      alt={card.name}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                      Sense imatge
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between text-sm">
                    <div className="text-neutral-900 font-medium leading-snug">
                      {card.name}
                    </div>
                    {card.base_price != null && (
                      <div className="text-right text-neutral-700 text-xs">
                        <div className="font-semibold">
                          {card.base_price} €
                        </div>
                        <div className="text-[10px] text-neutral-500 leading-tight">
                          / nit
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-neutral-600 flex flex-wrap gap-x-2 gap-y-1">
                    {card.town && <span>{card.town}</span>}
                    {card.region && (
                      <span className="text-neutral-400">
                        · {card.region}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-neutral-500 flex flex-wrap gap-2">
                    {card.type && (
                      <span className="rounded bg-neutral-100 px-2 py-0.5 border border-neutral-200 text-neutral-700">
                        {card.type}
                      </span>
                    )}
                    {card.capacity != null && (
                      <span className="rounded bg-neutral-100 px-2 py-0.5 border border-neutral-200 text-neutral-700">
                        {card.capacity} pax
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}




