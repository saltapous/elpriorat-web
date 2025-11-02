import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { updateOwner } from "../actions";

export default async function EditarOwnerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await supabaseServerReadOnly();

  const { data: owner, error } = await supabase
    .from("owners")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !owner) {
    console.error("[/admin/owners/[id]] error:", error?.message);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Editar propietari: {owner.name}
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateOwner(id, formData);
          }}
          className="space-y-4 bg-neutral-900/40 rounded-lg p-6 border border-neutral-800"
        >
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              name="name"
              defaultValue={owner.name}
              required
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              name="email"
              type="email"
              defaultValue={owner.email}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Introdueix un email vàlid (ex: info@maspriorat.cat)"
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
              suppressHydrationWarning
            />
          </div>

          {/* Telèfon */}
          <div>
            <label className="block text-sm font-medium mb-1">Telèfon</label>
            <input
              name="phone"
              defaultValue={owner.phone || ""}
              required
              pattern="^[0-9 +()-]{6,20}$"
              title="Només números, espais, + o parèntesis (màxim 20 caràcters)"
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              defaultValue={owner.notes || ""}
              rows={3}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            />
          </div>

          {/* Actiu */}
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked={owner.is_active}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-200">
              Propietari actiu
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="inline-flex items-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition"
            >
              Desa canvis
            </button>
            <a
              href="/admin/owners"
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


