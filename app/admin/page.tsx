// app/admin/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer"; // 👈 nom correcte

export default async function AdminHomePage() {
  // 👇 aquesta funció ha de ser async al fitxer lib/supabaseServer.ts
  const supabase = await supabaseServer();

  // Obtenim l'usuari actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  // Llista ràpida d'establiments de l'usuari
  const { data: establishments, error } = await supabase
    .from("establishments")
    .select("id, name, town, region")
    .order("name");

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <span>Panell</span>
        <Link
          href="/admin/establishments/new"
          className="rounded px-3 py-2 bg-sky-600 hover:bg-sky-500 text-sm"
        >
          Nou allotjament
        </Link>
      </h1>

      {error ? (
        <p className="text-red-400 text-sm">Error: {error.message}</p>
      ) : !establishments || establishments.length === 0 ? (
        <p className="text-neutral-400">Encara no tens cap establiment.</p>
      ) : (
        <ul className="space-y-2">
          {establishments.map((e) => (
            <li key={e.id} className="rounded bg-neutral-900 p-3">
              <strong>{e.name}</strong>
              {e.town ? ` — ${e.town}` : ""}
              {e.region ? ` (${e.region})` : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}




