// app/admin/allotjaments/nou/page.tsx
import { supabaseServer } from "@/lib/supabaseServer";
import { createAccommodation } from "../actions";
import Link from "next/link";

export default async function NouAllotjamentPage() {
  const supabase = supabaseServer();
  const { data: establishments } = await supabase
    .from("establishments")
    .select("id, name, town")
    .order("name");

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Nou allotjament</h1>
        <Link
          href="/admin/establishments/nou"
          className="text-sm text-blue-400 hover:text-blue-200"
        >
          + Nou establiment
        </Link>
      </div>

      <form action={createAccommodation} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Nom
          </label>
          <input
            name="name"
            required
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="Habitació doble amb vistes"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Descripció
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="Descripció breu..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Capacitat
            </label>
            <input
              name="capacity"
              type="number"
              min={1}
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
              placeholder="2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Preu base (€)
            </label>
            <input
              name="base_price"
              type="number"
              min={0}
              step="0.01"
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
              placeholder="120"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Establiment
          </label>
          <select
            name="establishment_id"
            required
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
          >
            <option value="">— Selecciona —</option>
            {establishments?.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name} {est.town ? `(${est.town})` : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Crear allotjament
        </button>
      </form>
    </main>
  );
}
