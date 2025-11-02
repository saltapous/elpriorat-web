// app/admin/owners/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function createOwner(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  let email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const is_active_raw = formData.get("is_active");
  const is_active = is_active_raw === "on" || is_active_raw === "true";

  if (!name) {
    throw new Error("El nom és obligatori.");
  }

  // 👇 LA CLAU: com que la columna és NOT NULL, si ve buit → ""
  if (!email) {
    email = "";
  }

  const supabase = await supabaseAdmin();

  const { error } = await supabase.from("owners").insert({
    name,
    email,
    phone,
    notes,
    is_active,
  });

  if (error) {
    console.error("[createOwner] error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function updateOwner(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  let email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const is_active_raw = formData.get("is_active");
  const is_active = is_active_raw === "on" || is_active_raw === "true";

  if (!id) throw new Error("Falta l'ID del propietari.");
  if (!name) throw new Error("El nom és obligatori.");

  if (!email) {
    email = "";
  }

  const supabase = await supabaseAdmin();

  const { error } = await supabase
    .from("owners")
    .update({
      name,
      email,
      phone,
      notes,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateOwner] error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}





