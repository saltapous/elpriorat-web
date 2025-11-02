// app/admin/allotjaments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminAllotjamentsPage() {
  const supabase = supabaseServerReadOnly();

  const { data: accs, error } = await supabase
    .from("accommodations")
    .select(
      `
        id,
        slug,
        name,
        is_active,
        establishments (
          id,
          name,
          town
        )
      `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin accommodations] error:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Allotjaments</h1>
        <Link
          href="/admin/allotjaments/nou"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
        >
          + Nou allotjament
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-left">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Establiment</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Estat</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {accs?.map((acc) => (
              <tr key={acc.id} className="border-t border-neutral-800">
                <td className="px-4 py-2">{acc.name}</td>
                <td className="px-4 py-2">
                  {acc.establishments
                    ? `${acc.establishments.name} (${acc.establishments.town})`
                    : "—"}
                </td>
                <td className="px-4 py-2">{acc.slug}</td>
                <td className="px-4 py-2">
                  {acc.is_active ? (
                    <span className="text-green-400">Actiu</span>
                  ) : (
                    <span className="text-red-400">Inactiu</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/allotjaments/${acc.slug}`}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {!accs?.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-neutral-400"
                >
                  No hi ha allotjaments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




