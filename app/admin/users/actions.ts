"use server";

import { supabaseAdmin } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function promoteToOwner(formData: FormData) {
  const profileId = formData.get("profile_id")?.toString();
  const ownerName = formData.get("owner_name")?.toString().trim() ?? "";

  if (!profileId) throw new Error("Falta el perfil");
  if (!ownerName) throw new Error("Falta el nom comercial / propietari");

  const supabase = supabaseAdmin();

  // 1) creem l'owner real
  const { data: owner, error: ownerErr } = await supabase
    .from("owners")
    .insert({
      name: ownerName,
      is_active: true,
    })
    .select("id")
    .maybeSingle();

  if (ownerErr) {
    console.error("[promoteToOwner] create owner", ownerErr);
    throw new Error(ownerErr.message);
  }

  // 2) actualitzem el profile
  const { error: profErr } = await supabase
    .from("profiles")
    .update({
      role: "owner",
      owner_id: owner?.id ?? null,
    })
    .eq("id", profileId);

  if (profErr) {
    console.error("[promoteToOwner] update profile", profErr);
    throw new Error(profErr.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/owners");
  redirect("/admin/users");
}
