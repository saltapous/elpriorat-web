import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { setAccommodationStatus } from "./actions";

export default async function AccommodationsPage() {
  const supabase = createServerSupabaseClient();

  const { data: accommodations, error } = await supabase
    .from("accommodations")
    .select(
      `
        id,
        name,
        slug,
        type,
        capacity,
        base_price,
        status,
        created_at,
        establishments!inner (
          id,
          name,
          town
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching accommodations:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Allotjaments
          </h1>
          <p className="text-sm text-neutral-400">
            Habitacions, cases, bungalows... Tot el que tens donat d’alta.
          </p>
        </div>

        <Link
          href="/admin/accommodations/new"
          className="inline-flex items-center justify-center rounded-lg bg-white text-neutral-900 text-sm font-medium px-3 py-2 hover:bg-neutral-200 transition"
        >
          + Nou allotjament
        </Link>
      </div>

      {/* Taula */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/40">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900/60 text-neutral-400 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Tipus</th>
              <th className="px-4 py-3 font-medium">Capacitat</th>
              <th className="px-4 py-3 font-medium">Preu base</th>
              <th className="px-4 py-3 font-medium">Establiment</th>
              <th className="px-4 py-3 font-medium">Estat</th>
              <th className="px-4 py-3 font-medium">Public URL</th>
              <th className="px-4 py-3 font-medium">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-200">
            {accommodations && accommodations.length > 0 ? (
              accommodations.map((acc) => (
                <tr key={acc.id} className="hover:bg-neutral-800/40">
                  <td className="px-4 py-3 text-white font-medium">
                    {acc.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{acc.type || "—"}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    {acc.capacity ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    {acc.base_price != null ? `${acc.base_price} €` : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    {acc.establishments?.name
                      ? `${acc.establishments.name} (${acc.establishments.town || "-"})`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300 border border-neutral-700">
                      {acc.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400 max-w-[160px] break-all">
                    {acc.slug && acc.status === "published"
                      ? `/allotjaments/${acc.slug}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <a
                        href={`/admin/accommodations/${acc.id}/images`}
                        className="text-xs text-neutral-300 hover:text-white border border-neutral-600 hover:border-white rounded px-2 py-1 text-center"
                      >
                        Imatges
                      </a>

                      {/* Botó publicar / despublicar */}
                      {acc.status === "published" ? (
                        <form
                          action={async () => {
                            "use server";
                            await setAccommodationStatus({
                              id: acc.id,
                              nextStatus: "draft",
                            });
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-neutral-300 hover:text-white border border-neutral-600 hover:border-white rounded px-2 py-1 text-center"
                          >
                            Despublicar
                          </button>
                        </form>
                      ) : (
                        <form
                          action={async () => {
                            "use server";
                            await setAccommodationStatus({
                              id: acc.id,
                              nextStatus: "published",
                            });
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-neutral-900 bg-white hover:bg-neutral-200 rounded px-2 py-1 text-center font-medium"
                          >
                            Publicar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-500 text-sm"
                >
                  Encara no tens cap allotjament creat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

