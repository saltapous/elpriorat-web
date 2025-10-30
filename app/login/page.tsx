"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // login OK ⇒ anem cap a l'admin (o on ens demanin)
    router.push(redirectTo);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-neutral-900/70 border border-neutral-700 rounded-xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-4 text-white text-center">
          Accés
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-neutral-300">
              Email
            </label>
            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-neutral-300">
              Contrasenya
            </label>
            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-neutral-900 font-medium text-sm rounded-lg py-2 hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {loading ? "Entrant..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
