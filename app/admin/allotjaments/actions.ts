"use server";

import { supabaseAdmin } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";

export async function createAccommodation(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const capacity = Number(formData.get("capacity") ?? 0);
  const base_price = Number(formData.get("base_price") ?? 0);
  const establishment_id = formData.get("establishment_id")?.toString() ?? "";
  const wantsActive = formData.get("is_active") === "on";

  if (!name) throw new Error("El nom és obligatori");
  if (!establishment_id) throw new Error("Cal un establiment");

  const supabase = supabaseAdmin();

  // 👇 comprovem establiment + owner
  const { data: est, error: estErr } = await supabase
    .from("establishments")
    .select("id, is_active, owner_id")
    .eq("id", establishment_id)
    .maybeSingle();

  if (estErr) {
    console.error("[createAccommodation] read est", estErr);
    throw new Error(estErr.message);
  }
  if (!est) {
    throw new Error("Establiment no trobat");
  }

  // llegim owner
  const { data: owner, error: ownerErr } = await supabase
    .from("owners")
    .select("is_active")
    .eq("id", est.owner_id)
    .maybeSingle();

  if (ownerErr) {
    console.error("[createAccommodation] read owner", ownerErr);
    throw new Error(ownerErr.message);
  }

  // si owner o establiment són inactius → allotjament inactiu
  const canBeActive = !!owner?.is_active && !!est.is_active;
  const is_active = canBeActive ? wantsActive : false;

  const slug = slugify(name);

  const { error } = await supabase.from("accommodations").insert({
    name,
    description: description || null,
    capacity: Number.isFinite(capacity) ? capacity : null,
    base_price: Number.isFinite(base_price) ? base_price : null,
    establishment_id,
    slug,
    is_active,
  });

  if (error) {
    console.error("[createAccommodation]", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/allotjaments");
  redirect("/admin/allotjaments");
}

export async function updateAccommodation(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const capacity = Number(formData.get("capacity") ?? 0);
  const base_price = Number(formData.get("base_price") ?? 0);
  const establishment_id = formData.get("establishment_id")?.toString() ?? "";
  const wantsActive = formData.get("is_active") === "on";

  if (!id) throw new Error("Falta id");
  if (!name) throw new Error("El nom és obligatori");
  if (!establishment_id) throw new Error("Cal un establiment");

  const supabase = supabaseAdmin();

  // llegim establiment + owner
  const { data: est, error: estErr } = await supabase
    .from("establishments")
    .select("id, is_active, owner_id")
    .eq("id", establishment_id)
    .maybeSingle();

  if (estErr) {
    console.error("[updateAccommodation] read est", estErr);
    throw new Error(estErr.message);
  }
  if (!est) {
    throw new Error("Establiment no trobat");
  }

  const { data: owner, error: ownerErr } = await supabase
    .from("owners")
    .select("is_active")
    .eq("id", est.owner_id)
    .maybeSingle();

  if (ownerErr) {
    console.error("[updateAccommodation] read owner", ownerErr);
    throw new Error(ownerErr.message);
  }

  const canBeActive = !!owner?.is_active && !!est.is_active;
  const is_active = canBeActive ? wantsActive : false;

  const slug = slugify(name);

  const { error: updErr } = await supabase
    .from("accommodations")
    .update({
      name,
      description: description || null,
      capacity: Number.isFinite(capacity) ? capacity : null,
      base_price: Number.isFinite(base_price) ? base_price : null,
      establishment_id,
      slug,
      is_active,
    })
    .eq("id", id);

  if (updErr) {
    console.error("[updateAccommodation]", updErr);
    throw new Error(updErr.message);
  }

  revalidatePath("/admin/allotjaments");
  redirect("/admin/allotjaments");
}



