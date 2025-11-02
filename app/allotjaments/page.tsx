// app/allotjaments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer"; // ✅ canviat

export default async function AllotjamentsPage() {
  const supabase = await supabaseServerReadOnly(); // ✅ fix: await i client correcte

  const { data, error } = await supabase
    .from("v_accommodations_for_web")
    .select("*")
    .order("establishment_name", { ascending: true });

  if (error) {
    console.error("[/allotjaments] supabase error:", error);
  }

  const allotjaments = data ?? [];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section
        className="relative h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/hero-priorat.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-semibold mb-2">Allotjaments al Priorat</h1>
          <p className="text-neutral-200">
            Allotjaments vinculats a establiments reals del territori.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        {allotjaments.map((item) => (
          <Link
            key={item.id}
            href={`/allotjaments/${item.slug}`}
            className="bg-neutral-900/50 rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-400 transition"
          >
            <div className="h-40 bg-neutral-800 relative">
              {item.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.cover_image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                  Sense imatge
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium mb-1">{item.name}</h2>
              <p className="text-sm text-neutral-400 mb-2">
                {item.town ?? "Priorat"}
                {item.region ? ` · ${item.region}` : ""}
              </p>
              {item.base_price ? (
                <p className="text-sm text-amber-300">
                  des de {item.base_price} €/nit
                </p>
              ) : (
                <p className="text-sm text-neutral-500">preu a consultar</p>
              )}
            </div>
          </Link>
        ))}

        {allotjaments.length === 0 && (
          <p className="text-neutral-400 col-span-full">
            Encara no hi ha allotjaments disponibles.
          </p>
        )}
      </section>
    </main>
  );
}






