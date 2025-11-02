// app/admin/actions.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export async function signOut() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
