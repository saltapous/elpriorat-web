// app/admin/owners/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export default async function OwnersListPage() {
  const supabase = supabaseServerReadOnly();
  const { data: owners } = await supabase
    .from("owners")
    .select("id, name, email, phone")
    .order("name");

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
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
        {(owners ?? []).map((o) => (
          <div key={o.id} className="p-4 flex justify-between gap-4">
            <div>
              <p className="text-white font-medium">{o.name}</p>
              <p className="text-sm text-neutral-400">{o.email}</p>
            </div>
            {o.phone ? (
              <p className="text-sm text-neutral-300">{o.phone}</p>
            ) : null}
          </div>
        ))}
        {!owners?.length && (
          <p className="p-4 text-neutral-400">Encara no hi ha propietaris.</p>
        )}
      </div>
    </main>
  );
}
