// app/lib/auth.ts
import "server-only";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type Role = "admin" | "owner" | "user" | null;

export async function getSessionWithRole(): Promise<{ user: any | null; role: Role }> {
  const supabase = await supabaseServerReadOnly();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) return { user: null, role: null };

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profErr) return { user, role: null };

  const role = (profile?.role as Role) ?? null;
  return { user, role };
}
