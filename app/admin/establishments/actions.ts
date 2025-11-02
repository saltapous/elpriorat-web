"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function updateEstablishment(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const owner_id = (formData.get("owner_id") as string) || null;
  const town = (formData.get("town") as string)?.trim() || null;
  const region = (formData.get("region") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || "";
  const website = (formData.get("website") as string)?.trim() || null;
  const is_active_raw = formData.get("is_active");
  const is_active = is_active_raw === "on" || is_active_raw === "true";

  if (!name) throw new Error("El nom és obligatori.");

  const supabase = await supabaseAdmin();

  // opcional: comprovació prèvia al servidor per mostrar error més maco
  if (is_active && owner_id) {
    const { data: owner } = await supabase
      .from("owners")
      .select("is_active")
      .eq("id", owner_id)
      .single();

    if (owner && owner.is_active === false) {
      throw new Error(
        "No pots activar aquest establiment perquè el propietari està inactiu."
      );
    }
  }

  const { error } = await supabase
    .from("establishments")
    .update({
      name,
      owner_id,
      town,
      region,
      phone,
      email,
      website,
      is_active,
    })
    .eq("id", id);

  if (error) {
    // aquí t’arribaria també l’error del trigger SQL de dalt
    console.error("[updateEstablishment] error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/establishments");
  redirect("/admin/establishments");
}

