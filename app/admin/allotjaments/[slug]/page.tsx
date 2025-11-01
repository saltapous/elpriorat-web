// app/allotjaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type Props = {
  params: {
    slug: string;
  };
};

export default async function AllotjamentPage({ params }: Props) {
  const { slug } = params;
  const supabase = supabaseServer();

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

  if (error || !data) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <a href="/allotjaments" className="text-sm text-neutral-400 hover:text-white">
          ← Tornar als allotjaments
        </a>

        <h1 className="text-3xl font-semibold">{data.name ?? "Sense nom"}</h1>

        <p className="text-neutral-200">
          {data.description ?? "Aquest allotjament encara no té descripció."}
        </p>

        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded bg-neutral-800 text-sm">
            {data.establishments?.town ?? "Sense població"}
          </span>
          {data.capacity ? (
            <span className="px-3 py-1 rounded bg-neutral-800 text-sm">
              Capacitat: {data.capacity}
            </span>
          ) : null}
          {data.base_price ? (
            <span className="px-3 py-1 rounded bg-neutral-800 text-sm">
              Des de {data.base_price} €
            </span>
          ) : null}
        </div>
      </div>
    </main>
  );
}

