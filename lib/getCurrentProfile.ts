// lib/getCurrentProfile.ts
import { supabaseServer } from "./supabaseServer";

export async function getCurrentProfile() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1️⃣ primer mirem el metadata
  let role = (user.user_metadata as any)?.role as string | undefined;

  // 2️⃣ si no hi ha rol, fem un “patch” perquè tu hi puguis entrar
  //    posa aquí el teu correu de Supabase
  if (!role) {
    if (user.email === "albertdelfondo@gmail.com") {
      role = "admin";
    } else {
      role = "user";
    }
  }

  return {
    id: user.id,
    email: user.email,
    role,
  };
}

