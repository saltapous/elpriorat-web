"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function createOwner(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const is_active = formData.get("is_active") === "on";

  if (!name) throw new Error("El nom és obligatori");

  const supabase = supabaseAdmin();

  const { error } = await supabase.from("owners").insert({
    name,
    email: email || null,
    phone: phone || null,
    is_active,
  });

  if (error) {
    console.error("[createOwner]", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function updateOwner(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const newIsActive = formData.get("is_active") === "on";

  if (!id) throw new Error("Falta l'id del propietari");
  if (!name) throw new Error("El nom és obligatori");

  const supabase = supabaseAdmin();

  // 1) llegim l’owner actual per saber si ha canviat l’estat
  const { data: currentOwner, error: readErr } = await supabase
    .from("owners")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();

  if (readErr) {
    console.error("[updateOwner] read", readErr);
    throw new Error(readErr.message);
  }

  const oldIsActive = currentOwner?.is_active ?? true;
  const hasStateChanged = oldIsActive !== newIsActive;

  // 2) actualitzem l’owner
  const { error: updErr } = await supabase
    .from("owners")
    .update({
      name,
      email: email || null,
      phone: phone || null,
      is_active: newIsActive,
    })
    .eq("id", id);

  if (updErr) {
    console.error("[updateOwner] update owner", updErr);
    throw new Error(updErr.message);
  }

  // 3) si NO ha canviat l’estat, aquí parem
  if (!hasStateChanged) {
    revalidatePath("/admin/owners");
    redirect("/admin/owners");
  }

  // 4) si SÍ ha canviat l’estat → cascada
  //    owners -> establishments
  const { data: updatedEstabs, error: estErr } = await supabase
    .from("establishments")
    .update({ is_active: newIsActive })
    .eq("owner_id", id)
    .select("id");

  if (estErr) {
    console.error("[updateOwner] cascade establishments", estErr);
    // no fem throw per no deixar trencada la UI, però ho podríem fer
  }

  // 5) establishments -> accommodations
  const estabIds = (updatedEstabs ?? []).map((e: any) => e.id);
  if (estabIds.length > 0) {
    const { error: accErr } = await supabase
      .from("accommodations")
      .update({ is_active: newIsActive })
      .in("establishment_id", estabIds);

    if (accErr) {
      console.error("[updateOwner] cascade accommodations", accErr);
    }
  }

  // 6) revalidem totes les vistes afectades
  revalidatePath("/admin/owners");
  revalidatePath("/admin/establishments");
  revalidatePath("/admin/allotjaments");
  redirect("/admin/owners");
}



