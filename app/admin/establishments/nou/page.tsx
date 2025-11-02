// app/admin/establishments/nou/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { createEstablishment } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNewEstablishmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorMsg } = await searchParams;

  const supabase = await supabaseServerReadOnly();
  const { data: owners } = await supabase
    .from("owners")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-neutral-50 mb-6">
        Nou establiment
      </h1>

      {errorMsg ? (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {decodeURIComponent(errorMsg)}
        </div>
      ) : null}

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-4">
        <form action={createEstablishment} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Nom
            </label>
            <input
              name="name"
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Propietari */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Propietari
            </label>
            <select
              name="owner_id"
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">— Sense propietari —</option>
              {owners?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Poble / Comarca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-100 mb-1">
                Poble
              </label>
              <input
                name="town"
                className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-100 mb-1">
                Comarca / zona
              </label>
              <input
                name="region"
                className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Telèfon */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Telèfon *
            </label>
            <input
              name="phone"
              required
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Email (ABANS de web) */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Email *
            </label>
            <input
              name="email"     // 👈 NOM EXACTE QUE LLEGEIX L’ACTION
              type="email"
              required
              suppressHydrationWarning
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Web (opcional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Web
            </label>
            <input
              name="website"
              placeholder="https://..."
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Actiu */}
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              defaultChecked
              className="h-4 w-4"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-100">
              Actiu
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm font-medium text-white"
          >
            Crear establiment
          </button>
        </form>
      </div>
    </div>
  );
}
