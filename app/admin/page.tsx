// app/admin/page.tsx
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-semibold text-white">Panell d’administració</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/owners"
          className="rounded bg-neutral-900 border border-neutral-800 p-4 hover:bg-neutral-800 transition"
        >
          <h2 className="text-lg font-medium text-white">Propietaris</h2>
          <p className="text-sm text-neutral-400">
            Crear i gestionar propietaris.
          </p>
        </Link>

        <Link
          href="/admin/establishments"
          className="rounded bg-neutral-900 border border-neutral-800 p-4 hover:bg-neutral-800 transition"
        >
          <h2 className="text-lg font-medium text-white">Establiments</h2>
          <p className="text-sm text-neutral-400">
            Assigna’ls a un propietari i edita’n les dades.
          </p>
        </Link>

        <Link
          href="/admin/allotjaments"
          className="rounded bg-neutral-900 border border-neutral-800 p-4 hover:bg-neutral-800 transition"
        >
          <h2 className="text-lg font-medium text-white">Allotjaments</h2>
          <p className="text-sm text-neutral-400">
            Habitacions, cases, bungalous...
          </p>
        </Link>
      </div>
    </main>
  );
}







