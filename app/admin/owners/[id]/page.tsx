// app/admin/owners/[id]/page.tsx

import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type PageProps = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function AdminOwnerEditPage({ params }: PageProps) {
  const { id } = params;

  // 👇 IMPORTANT: sense això tornava el mateix error que amb allotjaments
  const supabase = await supabaseServerReadOnly();

  // 1. Carreguem l'owner
  const { data: owner, error } = await supabase
    .from("owners")
    .select("id, name, email, phone, is_active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[/admin/owners/[id]] error:", error.message);
  }

  if (!owner) {
    return notFound();
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Editar propietari: {owner.name}
      </h1>

      <form
        action={`/admin/owners/${owner.id}/update`}
        className="space-y-4 bg-white p-4 rounded-lg shadow"
      >
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            name="name"
            defaultValue={owner.name ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={owner.email ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Telèfon */}
        <div>
          <label className="block text-sm font-medium mb-1">Telèfon</label>
          <input
            name="phone"
            defaultValue={owner.phone ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Actiu */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            name="is_active"
            defaultChecked={owner.is_active ?? true}
            className="h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm">
            Actiu
          </label>
        </div>

        {/* No mostrem cap slug perquè els owners no necessiten slug al panell */}

        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800"
        >
          Desa canvis
        </button>
      </form>
    </main>
  );
}


