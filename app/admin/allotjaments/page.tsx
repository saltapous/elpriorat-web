// app/admin/allotjaments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminAllotjamentsPage() {
  const supabase = await supabaseServerReadOnly(); // ✅ important el parèntesi i l'await

  const { data: accs, error } = await supabase
    .from("accommodations")
    .select(
      `
      id,
      name,
      capacity,
      base_price,
      is_active,
      establishments ( name, town, region )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("[/admin/allotjaments] error:", error.message);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Allotjaments
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Llistat d’allotjaments registrats al Priorat.
            </p>
          </div>

          <Link
            href="/admin/allotjaments/nou"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition"
          >
            <span>＋</span>
            <span>Nou allotjament</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Establiment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Poble
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Estat
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {accs && accs.length > 0 ? (
                accs.map((acc) => (
                  <tr key={acc.id} className="hover:bg-neutral-900/40">
                    <td className="px-4 py-3 text-sm text-neutral-100">
                      {acc.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-300">
                      {acc.establishments?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-300">
                      {acc.establishments?.town || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {acc.is_active ? (
                        <span className="text-green-500">Actiu</span>
                      ) : (
                        <span className="text-orange-500">Inactiu</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <Link
                        href={`/admin/allotjaments/${acc.id}`}
                        className="text-emerald-300 hover:text-emerald-200"
                      >
                        Editar →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-neutral-400"
                  >
                    No hi ha allotjaments encara.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}




