// app/admin/page.tsx
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Panell d’administració</h1>
      <ul className="space-y-2 text-amber-300">
        <li>
          <Link href="/admin/allotjaments">→ Allotjaments</Link>
        </li>
        <li>
          <Link href="/admin/establishments">→ Establiments</Link>
        </li>
      </ul>
    </main>
  );
}






