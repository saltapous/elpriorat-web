"use server";

import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

export async function getCommissionRate(): Promise<number> {
  const supabase = await supabaseServerReadOnly();

  // Requereix ser admin (com a mínim loguejat; la RLS també ho filtra)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("app_settings")
    .select("commission_rate")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return Number(data?.commission_rate ?? 0.1);
}

export async function updateCommissionRate(newRate: number) {
  if (newRate < 0 || newRate > 1) {
    throw new Error("El percentatge ha d'estar entre 0 i 1 (ex: 0.12 = 12%)");
  }
  // Admin client per assegurar bypass de caches i permisos
  const supabase = await supabaseAdmin();

  // Agafem la 1a fila (model simple de settings)
  const { data: existing, error: selErr } = await supabase
    .from("app_settings")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .single();
  if (selErr) throw selErr;

  const id = existing?.id ?? 1;

  const { error: upErr } = await supabase
    .from("app_settings")
    .update({ commission_rate: newRate, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (upErr) throw upErr;
}
