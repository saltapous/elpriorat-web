// app/admin/allotjaments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export default async function AdminAllotjamentsPage() {
  const supabase = supabaseServerReadOnly();

  const { data: accommodations, error } = await supabase
    .from("accommodations")
    .select(
      `
      id,
      slug,
      name,
      is_active,
      base_price,
      establishments ( id, name, town )
    `
    )
    .order("name");

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Allotjaments</h1>
        <Link
          href="/admin/allotjaments/nou"
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
        >
          + Nou allotjament
        </Link>
      </div>

      <div className="rounded border border-neutral-800 divide-y divide-neutral-800 bg-neutral-900/40">
        {(accommodations ?? []).map((acc) => (
          <div
            key={acc.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div>
              {/* 👇 ara també és enllaç al detall/edit */}
              <Link
                href={`/admin/allotjaments/${acc.slug}`}
                className="text-white font-medium hover:underline"
              >
                {acc.name}
              </Link>
              <p className="text-sm text-neutral-400">
                {acc.establishments
                  ? acc.establishments.name +
                    (acc.establishments.town
                      ? " · " + acc.establishments.town
                      : "")
                  : "Sense establiment"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-neutral-200">
                  {acc.base_price ? `${acc.base_price} €` : "—"}
                </p>
                <p
                  className={`text-xs ${
                    acc.is_active ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {acc.is_active ? "Actiu" : "Inactiu"}
                </p>
              </div>
              <Link
                href={`/admin/allotjaments/${acc.slug}`}
                className="text-xs px-3 py-1 rounded border border-neutral-600 text-neutral-100 hover:bg-neutral-800"
              >
                Edita
              </Link>
            </div>
          </div>
        ))}

        {!accommodations?.length && (
          <p className="p-4 text-neutral-500">Encara no hi ha allotjaments.</p>
        )}
      </div>
    </main>
  );
}




