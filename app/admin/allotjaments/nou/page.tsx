// app/admin/allotjaments/nou/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { createAccommodation } from "../actions"; // 👈 aquí era l’error

export const dynamic = "force-dynamic";

export default async function NouAllotjamentPage() {
  const supabase = await supabaseServerReadOnly();

  const { data: establishments, error } = await supabase
    .from("establishments")
    .select("id, name, town")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Nou allotjament</h1>

      <form action={createAccommodation} className="space-y-6">
        <div>
          <label className="block text-sm mb-1">Nom</label>
          <input
            name="name"
            required
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripció</label>
          <textarea
            name="description"
            rows={3}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Establiment</label>
          <select
            name="establishment_id"
            required
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">-- tria establiment --</option>
            {establishments?.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name} {est.town ? `· ${est.town}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Capacitat</label>
            <input
              type="number"
              name="capacity"
              defaultValue={2}
              min={1}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Preu base (€)</label>
            <input
              type="number"
              name="base_price"
              defaultValue={100}
              min={0}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked
            className="h-4 w-4"
          />
          <span>Actiu</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
