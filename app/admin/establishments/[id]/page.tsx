// app/admin/establishments/[id]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { updateEstablishment } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEstablishmentEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: errorMsg } = await searchParams;

  const supabase = await supabaseServerReadOnly();

  // 👇 IMPORTANT: aquí hi ha d’haver "email"
  const { data: establishment } = await supabase
  .from("establishments")
  .select("id, name, owner_id, town, region, phone, email, website, is_active, owners (is_active)")
  .eq("id", id)
  .single();


  if (!establishment) return notFound();

  const { data: owners } = await supabase
    .from("owners")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a
            href="/admin/establishments"
            className="text-sm text-neutral-300 hover:text-white"
          >
            ← Tornar
          </a>
          <h1 className="text-xl font-semibold text-neutral-50">
            Editar establiment
          </h1>
        </div>
      </div>

      {errorMsg ? (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {decodeURIComponent(errorMsg)}
        </div>
      ) : null}

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-4">
        <form action={updateEstablishment} className="space-y-4">
          <input type="hidden" name="id" value={establishment.id} />

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Nom
            </label>
            <input
              name="name"
              defaultValue={establishment.name ?? ""}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Descripció */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Descripció
            </label>
            <textarea
              name="description"
              defaultValue={establishment.description ?? ""}
              rows={4}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Adreça */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Adreça
            </label>
            <input
              name="address"
              defaultValue={establishment.address ?? ""}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Poble / Comarca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-100 mb-1">
                Poble
              </label>
              <input
                name="town"
                defaultValue={establishment.town ?? ""}
                className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-100 mb-1">
                Comarca / zona
              </label>
              <input
                name="region"
                defaultValue={establishment.region ?? ""}
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
              defaultValue={establishment.phone ?? ""}
              required
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 👇 EMAIL — aquí ha de sortir el que tens a la BBDD */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              suppressHydrationWarning
              defaultValue={establishment.email ?? ""}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Web */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Web
            </label>
            <input
              name="website"
              defaultValue={establishment.website ?? ""}
              placeholder="https://..."
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
              defaultValue={establishment.owner_id ?? ""}
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

          {/* Actiu */}
          <div className="flex items-center gap-2">
           <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={establishment.is_active}
              disabled={establishment.owners?.is_active === false}
              className="h-4 w-4"
            />
            <span>
              Actiu
              {establishment.owners?.is_active === false ? (
                <span className="ml-2 text-xs text-orange-500">
                  (no es pot activar: propietari inactiu)
            </span>
    ) : null}
  </span>
</label>

          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm font-medium text-white"
          >
            Desa canvis
          </button>
        </form>
      </div>
    </div>
  );
}
