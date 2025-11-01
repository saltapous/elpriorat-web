// app/admin/establishments/page.tsx
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminEstablishmentsPage() {
  const supabase = await supabaseServerReadOnly();

  const { data, error } = await supabase
    .from("establishments")
    .select(
      `
      id,
      name,
      town,
      region,
      address,
      phone,
      email,
      website,
      is_active
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("[/admin/establishments] supabase error:", error);
  }

  const establishments = data ?? [];

  return (
    <main className="min-h-screen px-6 py-8 bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Establiments</h1>
          <Link
            href="/admin/establishments/nou"
            className="bg-amber-400 text-neutral-900 font-medium px-4 py-2 rounded-lg hover:bg-amber-300 transition"
          >
            + Nou establiment
          </Link>
        </header>

        {establishments.length === 0 ? (
          <p className="text-neutral-400">Encara no hi ha establiments.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-neutral-800 text-neutral-400">
                <th className="py-2">Nom</th>
                <th className="py-2">Poble / regió</th>
                <th className="py-2">Telèfon</th>
                <th className="py-2">Email</th>
                <th className="py-2">Web</th>
                <th className="py-2">Estat</th>
                <th className="py-2 text-right">Accions</th>
              </tr>
            </thead>
            <tbody>
              {establishments.map((est) => (
                <tr
                  key={est.id}
                  className="border-b border-neutral-900 hover:bg-neutral-900/40"
                >
                  <td className="py-2 font-medium">{est.name}</td>
                  <td className="py-2 text-neutral-300">
                    {est.town ? est.town : "-"}
                    {est.region ? ` (${est.region})` : ""}
                  </td>
                  <td className="py-2">{est.phone || "-"}</td>
                  <td className="py-2">{est.email || "-"}</td>
                  <td className="py-2">{est.website || "-"}</td>
                  <td className="py-2">
                    {est.is_active ? (
                      <span className="text-green-400">Actiu</span>
                    ) : (
                      <span className="text-neutral-500">Inactiu</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/establishments/${est.id}`}
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


