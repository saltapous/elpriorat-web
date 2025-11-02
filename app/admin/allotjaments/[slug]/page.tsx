// app/admin/allotjaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { updateAccommodation } from "../actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminAllotjamentEditPage({ params }: PageProps) {
  const { slug } = await params; // NEXT 15: cal await

  const supabase = await supabaseServerReadOnly();

  // 🔴 aquí demanem TOT: establiment i propietari
  const { data: acc, error } = await supabase
    .from("accommodations")
    .select(
      `
        id,
        name,
        establishment_id,
        capacity,
        base_price,
        is_active,
        establishments (
          id,
          name,
          is_active,
          owners (
            id,
            name,
            is_active
          )
        )
      `
    )
    .eq("id", slug)
    .single();

  if (error || !acc) {
    console.error("[/admin/allotjaments/[slug]] error:", error?.message);
    return notFound();
  }

  // 👇 lògica de bloqueig
  const ownerInactive = acc.establishments?.owners?.is_active === false;
  const establishmentInactive = acc.establishments?.is_active === false;
  const blocked = ownerInactive || establishmentInactive;

  // 👇 triem el missatge segons quin nivell està apagant
  let blockedMsg = "";
  if (ownerInactive) {
    blockedMsg = "(no es pot activar: propietari inactiu)";
  } else if (establishmentInactive) {
    blockedMsg = "(no es pot activar: establiment inactiu)";
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Editar allotjament: {acc.name}
        </h1>

        <form
          action={updateAccommodation.bind(null, acc.id)}
          className="space-y-4 bg-neutral-900/40 rounded-lg p-6 border border-neutral-800"
        >
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              name="name"
              defaultValue={acc.name}
              required
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Establiment (de moment ocult) */}
          <input
            type="hidden"
            name="establishment_id"
            value={acc.establishment_id}
          />

          {/* Capacitat */}
          <div>
            <label className="block text-sm font-medium mb-1">Capacitat</label>
            <input
              name="capacity"
              type="number"
              min={0}
              defaultValue={acc.capacity ?? ""}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Preu base */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Preu base (€/nit)
            </label>
            <input
              name="base_price"
              type="number"
              step="0.01"
              min={0}
              defaultValue={acc.base_price ?? ""}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Actiu */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={acc.is_active}
              disabled={blocked}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
            />
            <span>
              Actiu{" "}
              {blockedMsg ? (
                <span className="ml-2 text-xs text-orange-500">{blockedMsg}</span>
              ) : null}
            </span>
          </label>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="inline-flex items-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition"
            >
              Desa canvis
            </button>
            <a
              href="/admin/allotjaments"
              className="text-sm text-neutral-300 hover:text-white"
            >
              ← Tornar
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}



