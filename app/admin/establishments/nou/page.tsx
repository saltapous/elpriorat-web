// app/admin/establishments/nou/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { createEstablishment } from "../actions";

export default async function NouEstablishmentPage() {
  const supabase = supabaseServerReadOnly();
  const { data: owners } = await supabase
    .from("owners")
    .select("id, name")
    .order("name");

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Nou establiment</h1>

      <form action={createEstablishment} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm text-neutral-200">Nom</label>
          <input
            name="name"
            required
            className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-neutral-200">
            Propietari
          </label>
          <select
            name="owner_id"
            required
            className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
          >
            <option value="">— Selecciona —</option>
            {(owners ?? []).map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-neutral-200">Poble</label>
            <input
              name="town"
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-neutral-200">
              Comarca / zona
            </label>
            <input
              name="region"
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>
        </div>

        {/* 👇 nou */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            defaultChecked
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm text-neutral-200">
            Actiu
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Crear establiment
        </button>
      </form>
    </main>
  );
}

