import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createAccommodation } from "./actions";

export default async function NewAccommodationPage() {
  const supabase = createServerSupabaseClient();

  // Agafem establiments d'aquest usuari (RLS ja limita a ell)
  const { data: establishments, error } = await supabase
    .from("establishments")
    .select("id, name, town")
    .order("name", { ascending: true });

  // No cal bloquejar si hi ha error, però ho podem loguejar
  if (error) {
    console.error("Error fetching establishments for select:", error);
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-white">
          Nou allotjament
        </h1>
        <p className="text-sm text-neutral-400">
          Dona d’alta una unitat concreta (habitació, casa sencera, bungalow...).
        </p>
      </div>

      <form
        action={createAccommodation}
        className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4"
      >
        {/* Establiment pare */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-200 font-medium">
            Forma part de l'establiment *
          </label>

          <select
            required
            name="establishment_id"
            className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="">— selecciona —</option>
            {establishments?.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name}
                {est.town ? ` (${est.town})` : ""}
              </option>
            ))}
          </select>

          <p className="text-xs text-neutral-500">
            Si encara no has creat l’establiment, primer crea’l a
            {" "}
            <span className="text-neutral-300">“Els meus establiments”</span>.
          </p>
        </div>

        {/* Nom allotjament */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-200 font-medium">
            Nom de l’allotjament *
          </label>
          <input
            required
            name="name"
            className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Suite amb terrassa i vistes"
          />
          <p className="text-xs text-neutral-500">
            Exemple: “Casa sencera 4 pax”, “Habitació doble superior”, “Bungalow rústic”.
          </p>
        </div>

        {/* Tipus */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-200 font-medium">
            Tipus *
          </label>
          <input
            required
            name="type"
            className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
            placeholder="casa / habitacio / bungalow..."
          />
        </div>

        {/* Capacitat i preu base */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">
              Capacitat (número de persones)
            </label>
            <input
              name="capacity"
              type="number"
              min={1}
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              defaultValue={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-200 font-medium">
              Preu base (€ / nit)
            </label>
            <input
              name="base_price"
              type="number"
              step="0.01"
              className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="120"
            />
          </div>
        </div>

        {/* Descripció */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-200 font-medium">
            Descripció
          </label>
          <textarea
            name="description"
            rows={4}
            className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30 resize-none"
            placeholder="Explica com és l’allotjament, l’espai, les vistes, etc."
          />
        </div>

        {/* Serveis */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-200 font-medium">
            Serveis principals
          </label>
          <input
            name="services"
            className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
            placeholder="wifi, piscina, aparcament privat..."
          />
          <p className="text-xs text-neutral-500">
            Escriu-los separats per coma. Exemple: wifi, piscina, esmorzar inclòs
          </p>
        </div>

        {/* Accions */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
          <a
            href="/admin/accommodations"
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
  );
}
