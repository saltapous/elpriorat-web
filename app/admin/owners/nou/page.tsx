"use client";

import { useState, useTransition } from "react";
import { createOwner } from "../actions";

export default function NouOwnerPage() {
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function validate(formData: FormData) {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();

    const errors: { name?: string; email?: string; phone?: string } = {};

    if (!name) {
      errors.name = "El nom és obligatori.";
    }

    // ⚠️ com que a la DB és NOT NULL, millor exigir email al formulari
    if (!email || email.length === 0) {
      errors.email = "L’email és obligatori.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Posa un email vàlid (ex: info@maspriorat.cat).";
    }

    if (phone && !/^[0-9 +()-]{6,20}$/.test(phone)) {
      errors.phone = "Telèfon amb format incorrecte.";
    }

    return errors;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    const formData = new FormData(e.currentTarget);
    const errors = validate(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    startTransition(async () => {
      try {
        await createOwner(formData);
      } catch (err: any) {
        setGlobalError(err.message ?? "Error al crear el propietari.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Nou propietari</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-neutral-900/40 rounded-lg p-6 border border-neutral-800"
        >
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              name="name"
              className={`w-full border rounded px-3 py-2 bg-neutral-900 text-neutral-100 ${
                fieldErrors.name ? "border-red-500" : "border-neutral-700"
              }`}
              placeholder="Mas del Priorat SL"
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              name="email"
              type="email"
              suppressHydrationWarning
              className={`w-full border rounded px-3 py-2 bg-neutral-900 text-neutral-100 ${
                fieldErrors.email ? "border-red-500" : "border-neutral-700"
              }`}
              placeholder="info@maspriorat.cat"
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            ) : (
              <p className="mt-1 text-xs text-neutral-500">
                Aquest email es farà servir per contactar el propietari.
              </p>
            )}
          </div>

          {/* Telèfon */}
          <div>
            <label className="block text-sm font-medium mb-1">Telèfon</label>
            <input
              name="phone"
              className={`w-full border rounded px-3 py-2 bg-neutral-900 text-neutral-100 ${
                fieldErrors.phone ? "border-red-500" : "border-neutral-700"
              }`}
              placeholder="+34 600 123 123"
            />
            {fieldErrors.phone ? (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>
            ) : null}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full border rounded px-3 py-2 bg-neutral-900 border-neutral-700 text-neutral-100"
              placeholder="Observacions internes..."
            />
          </div>

          {/* Actiu */}
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-200">
              Propietari actiu
            </label>
          </div>

          {globalError ? (
            <p className="text-red-400 text-sm">{globalError}</p>
          ) : null}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition disabled:opacity-60"
            >
              {isPending ? "Creant..." : "Crear propietari"}
            </button>
            <a
              href="/admin/owners"
              className="text-sm text-neutral-300 hover:text-white"
            >
              ← Cancel·lar
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}



