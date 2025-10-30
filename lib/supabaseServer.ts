// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Mode COMPLET: llegeix i POT ESCRIURE cookies.
 * Usa'l a /admin, auth, etc.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // ⚠️ aquestes 2 només funcionen en server actions / route handlers
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  return supabase;
}

/**
 * Mode LECTURA: només llegeix cookies, no n’escriu.
 * Usa'l a pàgines públiques (com /allotjaments/[slug])
 */
export async function supabaseServerReadOnly() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // 👇 aquestes 2 són no-op perquè Next no deixa escriure aquí
        set() {
          // no-op
        },
        remove() {
          // no-op
        },
      },
    }
  );

  return supabase;
}

