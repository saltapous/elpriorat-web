// app/admin/owners/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { getSessionWithRole } from "@/lib/auth";

type SP = Promise<Record<string, string | string[] | undefined>> | undefined;

type OwnerRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean | null;
};

function sortIcon(active: boolean, dir: "asc" | "desc") {
  if (!active) return "↕";
  return dir === "asc" ? "↑" : "↓";
}

export default async function AdminOwnersPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  // Protecció d'admin (coherent amb la resta del panell)
  const { role } = await getSessionWithRole();
  if (role !== "admin") redirect("/");

  const sp = (await searchParams) || {};
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) || "name";
  const dir = ((Array.isArray(sp.dir) ? sp.dir[0] : sp.dir) === "desc"
    ? "desc"
    : "asc") as "asc" | "desc";

  const supabase = await supabaseServerReadOnly();

  const { data, error } = await supabase
    .from("owners")
    .select("id, name, email, phone, is_active");

  if (error) {
    console.error("[admin owners] error:", error);
  }

  const rows = (data ?? []) as OwnerRow[];

  // Ordenació al servidor (JS) per mantenir el patró de les altres taules
  const collator = new Intl.Collator("ca", { sensitivity: "base", numeric: true });
  rows.sort((a, b) => {
    if (sort === "active") {
      const av = a.is_active ? 1 : 0;
      const bv = b.is_active ? 1 : 0;
      const cmp = av - bv;
      return dir === "asc" ? cmp : -cmp;
    } else {
      const av = a.name ?? "";
      const bv = b.name ?? "";
      const cmp = collator.compare(av, bv);
      return dir === "asc" ? cmp : -cmp;
    }
  });

  const nextDir = (col: string) =>
    sort === col && dir === "asc" ? "desc" : "asc";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Propietaris</h1>
        <Link
          href="/admin/owners/nou"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
        >
          + Nou propietari
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-left text-white">
            <tr>
              <th className="px-4 py-2">
                <Link
                  href={`?sort=name&dir=${nextDir("name")}`}
                  className="hover:underline"
                >
                  Nom{" "}
                  <span className="ml-1 opacity-70">
                    {sortIcon(sort === "name", dir)}
                  </span>
                </Link>
              </th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Telèfon</th>
              <th className="px-4 py-2">
                <Link
                  href={`?sort=active&dir=${nextDir("active")}`}
                  className="hover:underline"
                >
                  Estat{" "}
                  <span className="ml-1 opacity-70">
                    {sortIcon(sort === "active", dir)}
                  </span>
                </Link>
              </th>
              <th className="px-4 py-2">Accions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-neutral-800">
                <td className="px-4 py-2 text-neutral-200">{o.name}</td>
                <td className="px-4 py-2 text-neutral-300">{o.email ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-300">{o.phone ?? "—"}</td>
                <td className="px-4 py-2">
                  {o.is_active ? (
                    <span className="text-green-400">Actiu</span>
                  ) : (
                    <span className="text-amber-400">Inactiu</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/owners/${o.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                  No hi ha propietaris.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



