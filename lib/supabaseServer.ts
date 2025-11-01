// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * 👉 Client de LECTURA per a pàgines (usa cookies amb getAll/setAll)
 * El fem servir a: app/allotjaments/page.tsx, ... etc.
 */
export function supabaseServerReadOnly() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // en dev pot no deixar, no passa res
        }
      },
    },
  });
}

/**
 * 👉 Client d'ADMIN per a server actions
 * NO toca cookies → no hi ha error de `cookies().get(...)`
 * Usa la service role → pot fer INSERT encara que hi hagi RLS
 */
export function supabaseAdmin() {
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      // no llegim ni escrivim cookies en les actions
      getAll() {
        return [];
      },
      setAll() {
        // noop
      },
    },
  });
}
