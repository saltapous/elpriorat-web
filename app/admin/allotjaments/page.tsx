// app/admin/allotjaments/page.tsx
import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/auth";

type SP = Promise<Record<string, string | string[] | undefined>> | undefined;

type AccommodationRow = {
  id: string;
  slug?: string | null;
  name: string | null;
  type: string | null;
  capacity: number | null;
  base_price: number | null;
  is_active: boolean | null;
  establishments: {
    name: string | null;
    town: string | null;
    owners: { id: string; name: string | null } | null;
  } | null;
};

function sortIcon(active: boolean, dir: "asc" | "desc") {
  if (!active) return "↕";
  return dir === "asc" ? "↑" : "↓";
}

export default async function AdminAllotjamentsPage({
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
    .from("accommodations")
    .select(`
      id, slug, name, type, capacity, base_price, is_active,
      establishments (
        name, town,
        owners ( id, name )
      )
    `);
  if (error) throw error;

  const rows = (data ?? []) as AccommodationRow[];

  const collator = new Intl.Collator("ca", { sensitivity: "base", numeric: true });
  const getVal = (r: AccommodationRow, key: string) => {
    switch (key) {
      case "name":
        return r.name ?? "";
      case "establishment":
        return r.establishments?.name ?? "";
      case "owner":
        return r.establishments?.owners?.name ?? "";
      case "capacity":
        return r.capacity ?? 0;
      case "price":
        return r.base_price ?? 0;
      case "active":
        return r.is_active ? "1" : "0";
      default:
        return r.name ?? "";
    }
  };
  rows.sort((a, b) => {
    const av = getVal(a, sort);
    const bv = getVal(b, sort);
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : collator.compare(String(av), String(bv));
    return dir === "asc" ? cmp : -cmp;
  });

  const nextDir = (col: string) => (sort === col && dir === "asc" ? "desc" : "asc");

  const fmt = new Intl.NumberFormat("ca-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Allotjaments</h1>

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
                <Link href={`?sort=establishment&dir=${nextDir("establishment")}`} className="hover:underline">
                  Establiment <span className="ml-1 opacity-70">{sortIcon(sort==="establishment", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=owner&dir=${nextDir("owner")}`} className="hover:underline">
                  Propietari <span className="ml-1 opacity-70">{sortIcon(sort==="owner", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=capacity&dir=${nextDir("capacity")}`} className="hover:underline">
                  Capacitat <span className="ml-1 opacity-70">{sortIcon(sort==="capacity", dir)}</span>
                </Link>
              </th>
              <th>
                <Link href={`?sort=price&dir=${nextDir("price")}`} className="hover:underline">
                  Preu base <span className="ml-1 opacity-70">{sortIcon(sort==="price", dir)}</span>
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
            {rows.map((a) => (
              <tr key={a.id} className="[&>td]:px-4 [&>td]:py-3">
                <td className="text-neutral-200">{a.name}</td>
                <td className="text-neutral-300">{a.establishments?.name ?? "—"}</td>
                <td className="text-neutral-300">{a.establishments?.owners?.name ?? "—"}</td>
                <td className="text-neutral-300">{a.capacity ?? "—"}</td>
                <td className="text-neutral-300">
                  {a.base_price != null ? fmt.format(a.base_price) : "—"}
                </td>
                <td className={a.is_active ? "text-green-400" : "text-amber-400"}>
                  {a.is_active ? "Sí" : "No"}
                </td>
                <td>
                  <Link
                    href={`/admin/allotjaments/${a.slug ?? a.id}`}
                    className="text-sky-400 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
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








