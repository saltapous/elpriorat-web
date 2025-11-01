import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export default async function OwnersPage() {
  const supabase = supabaseServerReadOnly();

  const { data: owners } = await supabase
  .from("owners")
  .select("id, name, email, phone, is_active") // 👈 afegit
  .order("name");

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Propietaris</h1>
        <Link
          href="/admin/owners/nou"
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
        >
          + Nou propietari
        </Link>
      </div>

      <div className="rounded border border-neutral-800 divide-y divide-neutral-800 bg-neutral-900/40">
        {(owners ?? []).map((owner) => (
          <div
            key={owner.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-white font-medium">{owner.name}</p>
              <p className="text-sm text-neutral-400">
                {owner.email || "—"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-neutral-300">
                {owner.phone || "—"}
              </p>
<p
          className={`text-xs ${
            owner.is_active ? "text-green-300" : "text-red-300"
          }`}
        >
          {owner.is_active ? "Actiu" : "Inactiu"}
        </p>

              {/* 👇 botó d'edició per ID */}
              <Link
                href={`/admin/owners/${owner.id}`}
                className="text-sm px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
              >
                Edita
              </Link>
            </div>
          </div>
        ))}

        {!owners?.length && (
          <p className="p-4 text-neutral-500">Encara no hi ha propietaris.</p>
        )}
      </div>
    </main>
  );
}

