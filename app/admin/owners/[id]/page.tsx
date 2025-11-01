import { notFound } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { updateOwner } from "../actions";

type Props = {
  params: { id: string };
};

export default async function EditOwnerPage({ params }: Props) {
  const supabase = supabaseServerReadOnly();

  const { data: owner } = await supabase
    .from("owners")
    .select("id, name, email, phone, is_active")
    .eq("id", params.id)
    .maybeSingle();

  if (!owner) {
    return notFound();
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Editar propietari</h1>

      {/* MOLT IMPORTANT: action = updateOwner i els name=... correctes */}
      <form action={updateOwner} className="space-y-4">
        {/* id ocult */}
        <input type="hidden" name="id" value={owner.id} />

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Nom
          </label>
          <input
            name="name"                 // 👈 aquest és el que faltava que arribés bé
            defaultValue={owner.name ?? ""}
            required
            className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={owner.email ?? ""}
            className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            placeholder="info@maspriorat.cat"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Telèfon
          </label>
          <input
            name="phone"
            defaultValue={owner.phone ?? ""}
            className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            defaultChecked={owner.is_active ?? true}
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
          Desa canvis
        </button>
      </form>
    </main>
  );
}


