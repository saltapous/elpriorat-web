import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { promoteToOwner } from "./actions";

export default async function AdminUsersPage() {
  const supabase = supabaseServerReadOnly();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, owner_id")
    .order("created_at", { ascending: false });

  const { data: owners } = await supabase.from("owners").select("id, name");

  const ownersById = Object.fromEntries(
    (owners ?? []).map((o) => [o.id, o.name])
  );

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Usuaris</h1>

      <div className="rounded border border-neutral-800 divide-y divide-neutral-800 bg-neutral-900/40">
        {(profiles ?? []).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p className="text-white">{p.email}</p>
              <p className="text-sm text-neutral-400">Rol: {p.role}</p>
              {p.owner_id ? (
                <p className="text-xs text-neutral-500">
                  Owner: {ownersById[p.owner_id] || p.owner_id}
                </p>
              ) : null}
            </div>

            {/* si no és owner, botó per promocionar */}
            {p.role !== "owner" && p.role !== "admin" ? (
              <form action={promoteToOwner} className="flex gap-2">
                <input type="hidden" name="profile_id" value={p.id} />
                <input
                  required
                  name="owner_name"
                  placeholder="Nom del propietari"
                  className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm"
                />
                <button
                  type="submit"
                  className="text-sm px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Fer-lo owner
                </button>
              </form>
            ) : (
              <span className="text-xs text-green-300">Assignat</span>
            )}
          </div>
        ))}

        {!profiles?.length && (
          <p className="p-4 text-neutral-500">Cap usuari.</p>
        )}
      </div>
    </main>
  );
}
