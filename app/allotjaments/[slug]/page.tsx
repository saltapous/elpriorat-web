// app/allotjaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type Props = {
  params: { slug: string };
};

export default async function AllotjamentDetallPage({ params }: Props) {
  const { slug } = params;

  const supabase = supabaseServerReadOnly();

  const { data, error } = await supabase
    .from("accommodations")
    .select(
      `
      id,
      slug,
      name,
      description,
      capacity,
      base_price,
      is_active,
      establishments (
        id,
        name,
        town,
        region
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[/allotjaments/[slug]]", error);
  }

  if (!data) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
        <a
          href="/allotjaments"
          className="text-sm text-neutral-400 hover:text-white"
        >
          ← Tornar als allotjaments
        </a>

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">{data.name}</h1>
          <p className="text-neutral-400 text-sm">
            {data.establishments
              ? `${data.establishments.name} · ${data.establishments.town ?? ""}${
                  data.establishments.region
                    ? " (" + data.establishments.region + ")"
                    : ""
                }`
              : "Sense establiment"}
          </p>
          {!data.is_active && (
            <p className="text-xs inline-block px-2 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/30">
              No disponible
            </p>
          )}
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-medium text-white">Descripció</h2>
          {data.description ? (
            <p className="text-neutral-200 leading-relaxed">
              {data.description}
            </p>
          ) : (
            <p className="text-neutral-500 text-sm">
              Aquest allotjament encara no té descripció.
            </p>
          )}
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded bg-neutral-900/40 border border-neutral-800 p-4">
            <p className="text-xs text-neutral-400 uppercase">Capacitat</p>
            <p className="text-xl">
              {data.capacity ? `${data.capacity} pers.` : "—"}
            </p>
          </div>
          <div className="rounded bg-neutral-900/40 border border-neutral-800 p-4">
            <p className="text-xs text-neutral-400 uppercase">Preu base</p>
            <p className="text-xl">
              {data.base_price ? `${data.base_price} €` : "—"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}




