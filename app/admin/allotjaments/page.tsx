// app/admin/allotjaments/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAllotjamentsPage() {
  const supabase = await supabaseServerReadOnly();

  const { data, error } = await supabase
    .from("accommodations")
    .select(`
      id,
      name,
      slug,
      base_price,
      capacity,
      type,
      status,
      is_active,
      created_at,
      establishments (
        name,
        town,
        region
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[/admin/allotjaments] Supabase error:", error);
  }

  const allotjaments = data ?? [];

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Panell d’allotjaments</h1>
          <Link
            href="/admin/allotjaments/nou"
            className="bg-amber-400 text-neutral-900 font-medium px-4 py-2 rounded-lg hover:bg-amber-300 transition"
          >
            + Nou allotjament
          </Link>
        </header>

        {allotjaments.length === 0 ? (
          <p className="text-neutral-400">Encara no hi ha allotjaments.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-800 text-neutral-400">
                <th className="py-2">Nom</th>
                <th className="py-2">Establiment</th>
                <th className="py-2">Capacitat</th>
                <th className="py-2">Preu base</th>
                <th className="py-2">Estat</th>
                <th className="py-2 text-right">Accions</th>
              </tr>
            </thead>
            <tbody>
              {allotjaments.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-neutral-900 hover:bg-neutral-900/50 transition"
                >
                  <td className="py-2 font-medium">{a.name}</td>
                  <td className="py-2 text-neutral-400">
                    {a.establishments?.name
                      ? `${a.establishments.name}${
                          a.establishments.town
                            ? ` (${a.establishments.town})`
                            : ""
                        }`
                      : "-"}
                  </td>
                  <td className="py-2">{a.capacity || "-"}</td>
                  <td className="py-2">
                    {a.base_price ? `${a.base_price} €` : "-"}
                  </td>
                  <td className="py-2">
                    {a.is_active ? (
                      <span className="text-green-400">Actiu</span>
                    ) : (
                      <span className="text-neutral-500">Inactiu</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/allotjaments/${a.id}`}
                      className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


