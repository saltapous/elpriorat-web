"use server";

import { supabaseAdmin } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createEstablishment(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const owner_id = formData.get("owner_id")?.toString() ?? "";
  const town = formData.get("town")?.toString().trim() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const wantsActive = formData.get("is_active") === "on";

  if (!name) throw new Error("El nom és obligatori");
  if (!owner_id) throw new Error("Cal un propietari");

  const supabase = supabaseAdmin();

  // 👇 comprovem l’owner
  const { data: owner, error: ownerErr } = await supabase
    .from("owners")
    .select("is_active")
    .eq("id", owner_id)
    .maybeSingle();

  if (ownerErr) {
    console.error("[createEstablishment] read owner", ownerErr);
    throw new Error(ownerErr.message);
  }
  if (!owner) {
    throw new Error("Propietari no trobat");
  }

  // si l’owner està inactiu, l’establiment HA d’estar inactiu
  const is_active = owner.is_active ? wantsActive : false;

  const { error } = await supabase.from("establishments").insert({
    name,
    owner_id,
    town: town || null,
    region: region || null,
    is_active,
  });

  if (error) {
    console.error("[createEstablishment]", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/establishments");
  redirect("/admin/establishments");
}

export async function updateEstablishment(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() ?? "";
  const owner_id = formData.get("owner_id")?.toString() ?? "";
  const town = formData.get("town")?.toString().trim() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const wantsActive = formData.get("is_active") === "on";

  if (!id) throw new Error("Falta id");
  if (!name) throw new Error("El nom és obligatori");
  if (!owner_id) throw new Error("Cal un propietari");

  const supabase = supabaseAdmin();

  // 1) llegim l’establiment actual
  const { data: currentEst, error: readEstErr } = await supabase
    .from("establishments")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();

  if (readEstErr) {
    console.error("[updateEstablishment] read est", readEstErr);
    throw new Error(readEstErr.message);
  }

  // 2) llegim l’owner per saber si el podem activar
  const { data: owner, error: ownerErr } = await supabase
    .from("owners")
    .select("is_active")
    .eq("id", owner_id)
    .maybeSingle();

  if (ownerErr) {
    console.error("[updateEstablishment] read owner", ownerErr);
    throw new Error(ownerErr.message);
  }
  if (!owner) {
    throw new Error("Propietari no trobat");
  }

  // si l’owner és inactiu, encara que marquin “actiu” → queda inactiu
  const newIsActive = owner.is_active ? wantsActive : false;

  const oldIsActive = currentEst?.is_active ?? true;
  const hasStateChanged = oldIsActive !== newIsActive;

  // 3) actualitzem l’establiment
  const { error: updErr } = await supabase
    .from("establishments")
    .update({
      name,
      owner_id,
      town: town || null,
      region: region || null,
      is_active: newIsActive,
    })
    .eq("id", id);

  if (updErr) {
    console.error("[updateEstablishment] update", updErr);
    throw new Error(updErr.message);
  }

  // 4) si l’estat ha canviat → cascada a accommodations
  if (hasStateChanged) {
    const { error: accErr } = await supabase
      .from("accommodations")
      .update({ is_active: newIsActive })
      .eq("establishment_id", id);

    if (accErr) {
      console.error("[updateEstablishment] cascade accommodations", accErr);
    }
  }

  revalidatePath("/admin/establishments");
  revalidatePath("/admin/allotjaments");
  redirect("/admin/establishments");
}




