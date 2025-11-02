// app/admin/owners/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminOwnersPage() {
  const supabase = await supabaseServerReadOnly();

  const { data: owners, error } = await supabase
    .from("owners")
    .select("id, name, email, phone, is_active")
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin owners] error:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Propietaris</h1>
        <Link
          href="/admin/owners/nou"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
        >
          + Nou propietari
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-left">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Telèfon</th>
              <th className="px-4 py-2">Estat</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {owners?.map((o) => (
              <tr key={o.id} className="border-t border-neutral-800">
                <td className="px-4 py-2">{o.name}</td>
                <td className="px-4 py-2">{o.email ?? "—"}</td>
                <td className="px-4 py-2">{o.phone ?? "—"}</td>
                <td className="px-4 py-2">
                  {o.is_active ? (
                    <span className="text-green-400">Actiu</span>
                  ) : (
                    <span className="text-red-400">Inactiu</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/owners/${o.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {!owners?.length && (
              <tr>
                <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-neutral-400"
                >
                  No hi ha propietaris.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
