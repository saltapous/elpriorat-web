import Link from "next/link";
import { supabaseServerRSC } from "@/lib/supabaseServer";

export default async function EstablishmentsPage() {
  const supabase = supabaseServerRSC();

  // Demanem establiments visibles per l'usuari actual (RLS ho filtra)
  const { data: establishments, error } = await supabase
    .from("establishments")
    .select("id, name, town, region")
    .order("name");

  if (error) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Els meus establiments</h1>
        <p className="text-red-400 text-sm">Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <span>Els meus establiments</span>
        <Link
          href="/admin/establishments/new"
          className="rounded px-3 py-2 bg-sky-600 hover:bg-sky-500 text-sm"
        >
          Nou allotjament
        </Link>
      </h1>

      {(!establishments || establishments.length === 0) ? (
        <p className="text-neutral-400">Encara no tens cap establiment.</p>
      ) : (
        <ul className="space-y-2">
          {establishments.map((e) => (
            <li key={e.id}>
              <Link
                href={`/admin/establishments/${e.id}`}
                className="block rounded bg-neutral-900 p-3 hover:bg-neutral-800"
              >
                <strong>{e.name}</strong>
                {e.town ? ` — ${e.town}` : ""}
                {e.region ? ` (${e.region})` : ""}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

