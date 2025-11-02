// app/admin/allotjaments/[slug]/page.tsx

import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type PageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export default async function AdminAllotjamentEditPage({ params }: PageProps) {
  const { slug } = params;

  // 👇 IMPORTANT: aquí cal l'await, si no, supabase és una Promise
  const supabase = await supabaseServerReadOnly();

  // 1. carreguem l'allotjament per slug
  const { data: acc, error } = await supabase
    .from("accommodations")
    .select(
      "id, slug, name, establishment_id, base_price, is_active, type, capacity"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[/admin/allotjaments/[slug]] error:", error.message);
  }

  if (!acc) {
    return notFound();
  }

  // 2. carreguem establiments per mostrar al select (si el formulari el necessita)
  const { data: establishments } = await supabase
    .from("establishments")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Editar allotjament: {acc.name}
      </h1>

      <form
        action={`/admin/allotjaments/${acc.slug}/update`}
        // si ho fas amb server action directa, canvia-ho
        className="space-y-4 bg-white p-4 rounded-lg shadow"
      >
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            name="name"
            defaultValue={acc.name ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Establiment */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Establiment
          </label>
          <select
            name="establishment_id"
            defaultValue={acc.establishment_id ?? ""}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">— Selecciona —</option>
            {establishments?.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preu base */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Preu base (€)
          </label>
          <input
            type="number"
            step="0.01"
            name="base_price"
            defaultValue={acc.base_price ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Actiu / inactiu */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            name="is_active"
            defaultChecked={acc.is_active ?? false}
            className="h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm">
            Actiu
          </label>
        </div>

        {/* IMPORTANT: no mostrem el slug perquè es gestiona al servidor */}

        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800"
        >
          Desa canvis
        </button>
      </form>
    </main>
  );
}


