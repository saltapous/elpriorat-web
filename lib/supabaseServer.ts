// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/* ------------------------------------------------------------------
   1) Client per a PÀGINES / LAYOUTS (lectura)
   Ara també té getAll/setAll per no mostrar l’avís de Supabase.
   ------------------------------------------------------------------ */
export async function supabaseServerReadOnly() {
  const cookieStore = await cookies();

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      // Supabase ho prefereix així
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // en un RSC això pot rebentar, per això fem try/catch
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // en server components no sempre es pot fer set → l’ignorem
          }
        });
      },
    },
  });

  return supabase;
}

/* ------------------------------------------------------------------
   2) Client per a SERVER ACTIONS (auth, login, logout…)
   Aquí sí que volem que pugui escriure cookies.
   ------------------------------------------------------------------ */
export async function supabaseServerForActions() {
  const cookieStore = await cookies();

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  return supabase;
}

/* ------------------------------------------------------------------
   3) Client ADMIN (service role) per a inserts/updates
   No depèn de cookies.
   ------------------------------------------------------------------ */
export function supabaseAdmin() {
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get() {
          return "";
        },
      },
    }
  );

  return supabase;
}





