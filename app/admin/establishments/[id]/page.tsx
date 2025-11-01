import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { updateEstablishment } from "../actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditEstablishmentPage({ params }: PageProps) {
  const { id } = await params;

  if (id === "nou") {
    return notFound();
  }

  const supabase = await supabaseServerReadOnly();

  const { data: establishment, error } = await supabase
    .from("establishments")
    .select(`
      id,
      name,
      description,
      address,
      town,
      region,
      phone,
      email,
      website,
      is_active
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[/admin/establishments/[id]] supabase error:", error);
  if (!establishment) return notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateEstablishment(formData);
    redirect("/admin/establishments");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Editant establiment</p>
            <h1 className="text-2xl font-semibold">{establishment.name}</h1>
          </div>
          <Link
            href="/admin/establishments"
            className="text-sm text-neutral-300 hover:text-white"
          >
            ← Tornar al llistat
          </Link>
        </div>

        <form
          action={handleUpdate}
          className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-5"
        >
          <input type="hidden" name="id" value={establishment.id} />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="name"
              defaultValue={establishment.name ?? ""}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Descripció</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={establishment.description ?? ""}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Adreça</label>
            <input
              type="text"
              name="address"
              defaultValue={establishment.address ?? ""}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Poble</label>
              <input
                type="text"
                name="town"
                defaultValue={establishment.town ?? ""}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Comarca / regió</label>
              <input
                type="text"
                name="region"
                defaultValue={establishment.region ?? ""}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Telèfon</label>
              <input
                type="text"
                name="phone"
                defaultValue={establishment.phone ?? ""}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="text" // canvia a email si vols després
                name="email"
                defaultValue={establishment.email ?? ""}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Web</label>
            <input
              type="text"
              name="website"
              defaultValue={establishment.website ?? ""}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              defaultChecked={establishment.is_active}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-950"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-200">
              Actiu (es mostra al web)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/admin/establishments"
              className="px-4 py-2 rounded-lg border border-neutral-700 text-sm text-neutral-200 hover:bg-neutral-900"
            >
              Cancel·lar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-400 text-neutral-900 font-medium text-sm hover:bg-amber-300 transition"
            >
              Desa canvis
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

