// app/admin/establishments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export default async function EstablishmentsPage() {
  const supabase = supabaseServerReadOnly();

  const { data: establishments, error } = await supabase
    .from("establishments")
    .select(`
      id,
      name,
      town,
      region,
      is_active,
      owners ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/establishments]", error);
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Establiments</h1>
        <Link
          href="/admin/establishments/nou"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          + Nou establiment
        </Link>
      </div>

      <div className="rounded border border-neutral-800 divide-y divide-neutral-800 bg-neutral-900/40">
        {(establishments ?? []).map((est) => (
          <div
            key={est.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-white font-medium">{est.name}</p>
              <p className="text-sm text-neutral-400">
                {est.town || "Sense poble"} · {est.region || "Sense comarca"}
              </p>
              <p className="text-xs text-neutral-500">
                Propietari: {est.owners?.name || "—"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* 👇 aquí sí que surt l’estat */}
              <p
                className={`text-xs ${
                  est.is_active ? "text-green-300" : "text-red-300"
                }`}
              >
                {est.is_active ? "Actiu" : "Inactiu"}
              </p>

              <Link
                href={`/admin/establishments/${est.id}`}
                className="text-sm px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
              >
                Edita
              </Link>
            </div>
          </div>
        ))}

        {!establishments?.length && (
          <p className="p-4 text-neutral-500">
            Encara no hi ha establiments creats.
          </p>
        )}
      </div>
    </main>
  );
}



