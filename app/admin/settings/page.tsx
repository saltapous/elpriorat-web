// app/admin/settings/page.tsx
import { getCommissionRate, updateCommissionRate } from "./actions";
import { getSessionWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | undefined;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { role } = await getSessionWithRole();
  if (role !== "admin") redirect("/");

  const current = await getCommissionRate();

  const sp = (await searchParams) || {};
  const saved = Array.isArray(sp.saved) ? sp.saved[0] : sp.saved;

  async function action(formData: FormData) {
    "use server";
    const val = Number(formData.get("commission") || 0.1);
    await updateCommissionRate(val);
    // Si prefereixes tornar al panell directament, posa: redirect("/admin");
    redirect("/admin/settings?saved=1");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Configuració</h1>

      {saved === "1" && (
        <div className="mb-4 rounded-lg border border-green-700 bg-green-900/30 text-green-300 px-4 py-3">
          Canvis desats correctament.
        </div>
      )}

      <form action={action} className="space-y-4 max-w-sm">
        <label className="block">
          <span className="text-sm text-neutral-300">Comissió (entre 0 i 1)</span>
          <input
            name="commission"
            type="number"
            step="0.0001"
            defaultValue={current}
            className="mt-2 w-full rounded-lg bg-neutral-900 border border-neutral-700 p-3"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl px-4 py-2 bg-amber-500 text-black font-medium"
          >
            Desa
          </button>

          <a
            href="/admin"
            className="rounded-xl px-4 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-900"
          >
            Tornar al panell
          </a>
        </div>
      </form>
    </main>
  );
}

