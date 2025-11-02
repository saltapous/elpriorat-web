// app/admin/establishments/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminEstablishmentsPage() {
  const supabase = await supabaseServerReadOnly();

  const { data: ests, error } = await supabase
    .from("establishments")
    .select(
      `
      id,
      name,
      town,
      region,
      is_active,
      owner_id,
      owners:owner_id (
        id,
        name
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("[/admin/establishments] error:", error.message);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* capçalera */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-50">
          Establiments
        </h1>
        <a
          href="/admin/establishments/nou"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md"
        >
          Nou establiment
        </a>
      </div>

      {/* taula fosca */}
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/50">
        <table className="min-w-full divide-y divide-neutral-800 text-sm">
          <thead className="bg-neutral-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">
                Ubicació
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">
                Propietari
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">
                Estat
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {ests?.map((est) => (
              <tr
                key={est.id}
                className="hover:bg-neutral-900/40 transition-colors"
              >
                <td className="px-4 py-3 text-neutral-50">{est.name}</td>
                <td className="px-4 py-3 text-neutral-400 text-xs">
                  {est.town || "—"}
                  {est.region ? ` · ${est.region}` : ""}
                </td>
                <td className="px-4 py-3 text-neutral-200 text-xs">
                  {est.owners?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      est.is_active
                        ? "bg-emerald-900/40 text-emerald-200"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {est.is_active ? "Actiu" : "Inactiu"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/establishments/${est.id}`}
                    className="text-neutral-300 hover:text-white text-sm"
                  >
                    Edita →
                  </a>
                </td>
              </tr>
            ))}

            {!ests?.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-neutral-500 text-sm"
                >
                  No hi ha establiments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




