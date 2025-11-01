// app/admin/establishments/nou/page.tsx
import { supabaseServer } from "@/lib/supabaseServer";
import { createEstablishment } from "../actions";
import Link from "next/link";

export default async function NouEstablimentPage() {
  const supabase = supabaseServer();
  const { data: owners } = await supabase
    .from("owners")
    .select("id, name")
    .order("name");

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Nou establiment</h1>
        <Link
          href="/admin/owners/nou"
          className="text-sm text-blue-400 hover:text-blue-200"
        >
          + Nou propietari
        </Link>
      </div>

      <form action={createEstablishment} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Nom
          </label>
          <input
            name="name"
            required
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="Mas de la Serra"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Propietari
          </label>
          <select
            name="owner_id"
            required
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100"
          >
            <option value="">— Selecciona —</option>
            {owners?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {!owners?.length ? (
            <p className="text-xs text-red-400 mt-1">
              No hi ha propietaris. Crea’n un primer.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Població
            </label>
            <input
              name="town"
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
              placeholder="El Masroig"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Comarca
            </label>
            <input
              name="region"
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
              placeholder="Priorat"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Adreça
          </label>
          <input
            name="address"
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="Camí de..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Telèfon
            </label>
            <input
              name="phone"
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-neutral-200">
              Web
            </label>
            <input
              name="website"
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
              placeholder="https://..."
            />
          </div>
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
