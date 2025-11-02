// app/admin/allotjaments/nou/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { createAccommodation } from "../actions";

export const dynamic = "force-dynamic";

export default async function NouAllotjamentPage() {
  const supabase = await supabaseServerReadOnly();

  const { data: establishments } = await supabase
    .from("establishments")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Nou allotjament</h1>

        <form
          action={createAccommodation}
          className="space-y-4 bg-neutral-900/40 rounded-lg p-6 border border-neutral-800"
        >
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              name="name"
              required
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
              placeholder="Habitació doble amb vistes"
            />
          </div>

          {/* Establiment */}
          <div>
            <label className="block text-sm font-medium mb-1">Establiment *</label>
            <select
              name="establishment_id"
              required
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            >
              <option value="">— Tria establiment —</option>
              {establishments?.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.name}
                </option>
              ))}
            </select>
          </div>

          {/* Capacitat */}
          <div>
            <label className="block text-sm font-medium mb-1">Capacitat</label>
            <input
              name="capacity"          // 👈 NOM EXACTE
              type="number"
              min={0}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
              placeholder="2"
            />
          </div>

          {/* Preu base */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Preu base (€/nit)
            </label>
            <input
              name="base_price"        // 👈 NOM EXACTE
              type="number"
              step="0.01"
              min={0}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
              placeholder="120"
            />
          </div>

          {/* Actiu */}
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-200">
              Actiu
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="inline-flex items-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition"
            >
              Crear allotjament
            </button>
            <a
              href="/admin/allotjaments"
              className="text-sm text-neutral-300 hover:text-white"
            >
              ← Cancel·lar
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

