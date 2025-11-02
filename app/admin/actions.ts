// app/admin/actions.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseServerForActions } from "@/lib/supabaseServer";

export async function logoutAction() {
  const supabase = await supabaseServerForActions();
  await supabase.auth.signOut();
  redirect("/login");
}
