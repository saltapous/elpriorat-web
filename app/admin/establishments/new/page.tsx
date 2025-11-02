import { supabaseServerRSC } from "@/lib/supabaseServer";
import { createEstablishment } from "./actions";

export default async function NewEstablishmentPage() {
  const supabase = supabaseServerRSC();

  // Comprovem si l'usuari és admin
  const { data: adminRow } = await supabase.from("me_is_admin").select("*").single();
  const isAdmin = !!adminRow?.is_admin;

  // Si és admin, pot triar propietari
  const { data: owners } = isAdmin
    ? await supabase.from("owners").select("id, name, email").order("name")
    : { data: [] as Array<{ id: string; name: string | null; email: string | null }> };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-semibold text-white">Nou establiment</h1>
          <p className="text-sm text-neutral-400">
            Introdueix les dades bàsiques. Després podràs afegir fotos i allotjaments
            individuals (habitacions, cases, bungalows...).
          </p>
        </div>

        <form
          action={createEstablishment}
          className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4"
        >
          {/* Propietari (només per admins) */}
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-200 font-medium">Propietari</label>
              <select
                name="owner_id"
                className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un propietari…
                </option>
                {(owners ?? []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name ?? o.email ?? o.id.slice(0, 8)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500">
                Si no selecciones res, el sistema assignarà el creador com a propietari.
              </p>
            </div>
          )}

          {/* Nom de l'establiment */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">
              Nom de l'establiment *
            </label>
            <input
              required
              name="name"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Casa del Montsant"
            />
            <p className="text-xs text-neutral-500">
              Exemple: “Casa Rural El Montsant”, “Càmping Vinça”, “Hotel Prior Terra”...
            </p>
          </div>

          {/* Poble */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">Poble / municipi</label>
            <input
              name="town"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="La Morera de Montsant"
            />
          </div>

          {/* Regió */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">Comarca / zona</label>
            <input
              name="region"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Priorat / Montsant / etc."
            />
          </div>

          {/* Adreça */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">Adreça</label>
            <input
              name="address"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Carrer Major, 12"
            />
          </div>

          {/* Descripció */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">Descripció</label>
            <textarea
              name="description"
              rows={4}
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30 resize-none"
              placeholder="Explica què ofereix l'establiment, entorn, ambient, serveis generals..."
            />
          </div>

          {/* Contacte */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-200 font-medium">Telèfon</label>
              <input
                name="phone"
                className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
                placeholder="+34 600 123 456"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-200 font-medium">Email</label>
              <input
                suppressHydrationWarning
                type="email"
                name="email"
                className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
                placeholder="contacte@exemple.com"
              />
            </div>
          </div>

          {/* Web */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">Web (opcional)</label>
            <input
              name="website"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="https://elmeuestabliment.cat"
            />
          </div>

          {/* Botons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
            <a
              href="/admin"
              className="text-sm text-neutral-400 hover:text-neutral-200 transition text-center px-3 py-2"
            >
              Cancel·lar
            </a>

            <button
              type="submit"
              className="rounded-lg bg-white text-neutral-900 text-sm font-medium px-4 py-2 hover:bg-neutral-200 transition"
            >
              Guardar com a esborrany
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
