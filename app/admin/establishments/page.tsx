// app/admin/establishments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/auth";

type SP = Promise<Record<string, string | string[] | undefined>> | undefined;

type EstablishmentRow = {
  id: string;
  slug?: string | null;
  name: string | null;
  town: string | null;
  region: string | null;
  is_active: boolean | null;
  owners: { id: string; name: string | null } | null;
};

function sortIcon(active: boolean, dir: "asc" | "desc") {
  if (!active) return "↕";
  return dir === "asc" ? "↑" : "↓";
}

export default async function AdminEstablishmentsPage({
  searchParams,
}: { searchParams?: SP }) {
  const { role } = await getSessionWithRole();
  if (role !== "admin") redirect("/");

  const sp = (await searchParams) || {};
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) || "name";
  const dir = ((Array.isArray(sp.dir) ? sp.dir[0] : sp.dir) === "desc"
    ? "desc"
    : "asc") as "asc" | "desc";

  const supabase = await supabaseServerReadOnly();
  const { data, error } = await supabase
    .from("establishments")
    .select(`
      id, slug, name, town, region, is_active,
      owners ( id, name )
    `);
  if (error) throw error;

  const rows = (data ?? []) as EstablishmentRow[];

  const collator = new Intl.Collator("ca", { sensitivity: "base", numeric: true });
  const getVal = (r: EstablishmentRow, key: string) => {
    switch (key) {
      case "name":
        return r.name ?? "";
      case "town":
        return r.town ?? "";
      case "region":
        return r.region ?? "";
      case "owner":
        return r.owners?.name ?? "";
      case "active":
        return r.is_active ? "1" : "0";
      default:
        return r.name ?? "";
    }
  };

  rows.sort((a, b) => {
    const av = getVal(a, sort);
    const bv = getVal(b, sort);
    const cmp = collator.compare(String(av), String(bv));
    return dir === "asc" ? cmp : -cmp;
  });

  const nextDir = (col: string) => (sort === col && dir === "asc" ? "desc" : "asc");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Establiments</h1>

      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900/60 text-white">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
              <th>
                <Link href={`?sort=name&dir=${nextDir("name")}`} className="hover:underline">
                  Nom <span className="ml-1 opacity-70">{sortIcon(sort==="name", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=town&dir=${nextDir("town")}`} className="hover:underline">
                  Població <span className="ml-1 opacity-70">{sortIcon(sort==="town", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=region&dir=${nextDir("region")}`} className="hover:underline">
                  Comarca <span className="ml-1 opacity-70">{sortIcon(sort==="region", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=owner&dir=${nextDir("owner")}`} className="hover:underline">
                  Propietari <span className="ml-1 opacity-70">{sortIcon(sort==="owner", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=active&dir=${nextDir("active")}`} className="hover:underline">
                  Actiu <span className="ml-1 opacity-70">{sortIcon(sort==="active", dir)}</span>
                </Link>
              </th>
              <th className="w-28">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {rows.map((e) => (
              <tr key={e.id} className="[&>td]:px-4 [&>td]:py-3">
                <td className="text-neutral-200">{e.name}</td>
                <td className="text-neutral-300">{e.town}</td>
                <td className="text-neutral-300">{e.region}</td>
                <td className="text-neutral-300">{e.owners?.name ?? "—"}</td>
                <td className={e.is_active ? "text-green-400" : "text-amber-400"}>
                  {e.is_active ? "Sí" : "No"}
                </td>
                <td>
                  <Link
                    href={`/admin/establishments/${e.slug ?? e.id}`}
                    className="text-sky-400 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  Cap registre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}







