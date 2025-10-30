// app/admin/establishments/new/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServerAction } from "@/lib/supabaseServer";

export async function createEstablishment(formData: FormData) {
  const supabase = supabaseServerAction();

  // Dades del formulari
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const town = String(formData.get("town") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  // Ets admin?
  const { data: adminRow, error: adminErr } = await supabase
    .from("me_is_admin")
    .select("*")
    .single();

  if (adminErr) throw new Error(adminErr.message);
  const isAdmin = !!adminRow?.is_admin;

  // L'admin pot passar owner_id; la resta s'ignora (trigger ho fixarà a auth.uid()).
  const owner_id = isAdmin ? (formData.get("owner_id") as string | null) : null;

  const { error } = await supabase.from("establishments").insert([
    { owner_id, name, description, town, region, address, phone, email, website },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  redirect("/admin"); // torna al panell
}
