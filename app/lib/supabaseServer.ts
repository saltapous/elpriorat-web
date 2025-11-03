// app/lib/supabaseServer.ts
import "server-only";
import { cookies, headers } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Client de lectura al servidor (no escriu cookies).
 * Útil per Server Components / Server Actions on NO volem tocar cookies.
 */
export async function supabaseServerReadOnly() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    throw new Error("Falten variables d'entorn NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // No-ops per evitar warnings d'@supabase/ssr a Server Actions
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    },
    headers: {
      // ajuda a supabase a fer SSR més “cache-friendly” en Next 15
      "X-Forwarded-For": (await headers()).get("x-forwarded-for") ?? "",
    },
  });
}

/**
 * Client de servidor amb capacitat d'escriure cookies (si ho necessites).
 * Fes-lo servir en Route Handlers/Layouts on `cookies()` permet set/remove.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    throw new Error("Falten variables d'entorn NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}
