// app/admin/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServerReadOnly();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* TOPBAR ADMIN */}
      <header className="bg-neutral-950/80 border-b border-neutral-800 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm uppercase tracking-wide text-neutral-400">
              elpriorat.cat
            </span>
            <span className="text-neutral-50 font-semibold">Admin</span>
          </div>

          <nav className="flex gap-4 text-sm text-teal-200/80">
            <a href="/admin/allotjaments" className="hover:text-white">
              Allotjaments
            </a>
            <a href="/admin/establishments" className="hover:text-white">
              Establiments
            </a>
            <a href="/admin/owners" className="hover:text-white">
              Propietaris
            </a>
          </nav>

          {/* Usuari + Sortir */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-300">
              {user.email ?? "Usuari"}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
              >
                Sortir
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* CONTINGUT */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}









