// app/admin/owners/nou/page.tsx
import { createOwner } from "../actions";

export default function NouOwnerPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Nou propietari</h1>

      <form action={createOwner} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Nom
          </label>
          <input
            name="name"
            required
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="Mas del Priorat SL"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Email
          </label>
          <input
            name="email"
            type="email"
            suppressHydrationWarning
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="info@maspriorat.cat"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-neutral-200">
            Telèfon
          </label>
          <input
            name="phone"
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            placeholder="+34 600 000 000"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Crear propietari
        </button>
      </form>
    </main>
  );
}

