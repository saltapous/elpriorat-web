import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServerRSC } from "@/lib/supabaseServer";

export default async function EstablishmentDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServerRSC();

  // Carreguem l'establiment (RLS evitarà accés si no ets propietari/admin)
  const { data: est, error } = await supabase
    .from("establishments")
    .select(
      "id, name, description, town, region, address, phone, email, website, created_at, updated_at"
    )
    .eq("id", params.id)
    .single();

  if (error) {
    // Si l'error és "No rows" → 404
    return notFound();
  }
  if (!est) return notFound();

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm">
        <Link href="/admin/establishments" className="text-neutral-400 hover:text-neutral-200">
          ← Tornar als establiments
        </Link>
      </div>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{est.name}</h1>
          <p className="text-neutral-400">
            {[est.town, est.region].filter(Boolean).join(" — ")}
          </p>
        </div>

        {/* CTA placeholders (editar / nou allotjament) */}
        <div className="flex gap-2">
          <Link
            href={`/admin/establishments/${est.id}/edit`}
            className="rounded px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            Editar
          </Link>
          <Link
            href={`/admin/establishments/${est.id}/accommodations/new`}
            className="rounded px-3 py-2 bg-sky-600 hover:bg-sky-500 text-sm"
          >
            Nou allotjament
          </Link>
        </div>
      </header>

      {/* Dades */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded bg-neutral-900 p-4 space-y-2">
          <h2 className="font-medium mb-2">Contacte</h2>
          <div className="text-sm text-neutral-300 space-y-1">
            {est.address && <div>📍 {est.address}</div>}
            {est.phone && <div>📞 {est.phone}</div>}
            {est.email && <div>✉️ {est.email}</div>}
            {est.website && <div>🌐 {est.website}</div>}
          </div>
        </div>

        <div className="rounded bg-neutral-900 p-4 space-y-2">
          <h2 className="font-medium mb-2">Informació</h2>
          <div className="text-sm text-neutral-300 space-y-1">
            {est.created_at && (
              <div>
                Creat: {new Date(est.created_at).toLocaleString()}
              </div>
            )}
            {est.updated_at && (
              <div>
                Darrera actualització: {new Date(est.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Descripció */}
      <section className="rounded bg-neutral-900 p-4">
        <h2 className="font-medium mb-2">Descripció</h2>
        <p className="text-sm text-neutral-300 whitespace-pre-line">
          {est.description || "Sense descripció."}
        </p>
      </section>

      {/* Allotjaments (placeholder) */}
      <section className="rounded bg-neutral-900 p-4">
        <h2 className="font-medium mb-2">Allotjaments</h2>
        <p className="text-sm text-neutral-400">
          Encara no n’hi ha cap. Pots crear-ne amb el botó “Nou allotjament”.
        </p>
      </section>
    </main>
  );
}
