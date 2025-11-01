// app/admin/allotjaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import {
  supabaseServerReadOnly,
} from "@/lib/supabaseServer";
import { updateAccommodation } from "../actions";

type Props = {
  params: { slug: string };
};

export default async function AdminAllotjamentEditPage({ params }: Props) {
  const supabase = supabaseServerReadOnly();

  // 1. llegim l'allotjament
  const { data: acc } = await supabase
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
      establishment_id
    `
    )
    .eq("slug", params.slug)
    .maybeSingle();

  if (!acc) {
    return notFound();
  }

  // 2. llegim establiments per al select
  const { data: establishments } = await supabase
    .from("establishments")
    .select("id, name, town")
    .order("name");

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-white">
        Editar allotjament
      </h1>

      <form action={updateAccommodation} className="space-y-4">
        {/* cal per identificar a l'update */}
        <input type="hidden" name="id" value={acc.id} />
        <input type="hidden" name="slug" value={acc.slug} />

        <div>
          <label className="block mb-1 text-sm text-neutral-200">
            Nom
          </label>
          <input
            name="name"
            defaultValue={acc.name ?? ""}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-neutral-200">
            Descripció
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={acc.description ?? ""}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-neutral-200">
              Capacitat
            </label>
            <input
              name="capacity"
              type="number"
              min={1}
              defaultValue={acc.capacity ?? ""}
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-neutral-200">
              Preu base (€)
            </label>
            <input
              name="base_price"
              type="number"
              step="0.01"
              defaultValue={acc.base_price ?? ""}
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm text-neutral-200">
            Establiment
          </label>
          <select
            name="establishment_id"
            defaultValue={acc.establishment_id ?? ""}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
          >
            <option value="">— Sense establiment —</option>
            {establishments?.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name} {est.town ? `(${est.town})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            defaultChecked={acc.is_active ?? false}
            className="h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm text-neutral-200">
            Actiu
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Desa canvis
        </button>
      </form>
    </main>
  );
}


