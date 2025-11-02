// app/admin/allotjaments/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";

// helper: fem slug a partir del nom
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

async function generateUniqueAccommodationSlug(baseName: string): Promise<string> {
  const supabase = await supabaseAdmin();
  const baseSlug = slugify(baseName) || "allotjament";
  let candidate = baseSlug;
  let counter = 1;

  while (counter < 20) {
    const { data } = await supabase
      .from("accommodations")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

// 🟢 CREA
export async function createAccommodation(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const establishment_id = (formData.get("establishment_id") as string) || null;

  // 👇 AIXÒ ÉS EL QUE IMPORTA
  const capacityStr = formData.get("capacity")?.toString() ?? "";
  const basePriceStr = formData.get("base_price")?.toString() ?? "";

  const capacity = capacityStr === "" ? null : Number(capacityStr);
  const base_price = basePriceStr === "" ? null : Number(basePriceStr);

  const is_active_raw = formData.get("is_active");
  const is_active = is_active_raw === "on" || is_active_raw === "true";

  if (!name) throw new Error("El nom és obligatori.");
  if (!establishment_id) throw new Error("Has de triar un establiment.");

  const slug = await generateUniqueAccommodationSlug(name);

  const supabase = await supabaseAdmin();

  // (si vols, aquí la validació de cascada com abans)
  const { error } = await supabase.from("accommodations").insert({
    name,
    slug,
    establishment_id,
    capacity,
    base_price,
    is_active,
  });

  if (error) {
    console.error("[createAccommodation] error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/allotjaments");
  redirect("/admin/allotjaments");
}

// 🟠 UPDATE
export async function updateAccommodation(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const establishment_id = (formData.get("establishment_id") as string) || null;

  const capacityStr = formData.get("capacity")?.toString() ?? "";
  const basePriceStr = formData.get("base_price")?.toString() ?? "";

  const capacity = capacityStr === "" ? null : Number(capacityStr);
  const base_price = basePriceStr === "" ? null : Number(basePriceStr);

  const is_active_raw = formData.get("is_active");
  const is_active = is_active_raw === "on" || is_active_raw === "true";

  if (!id) throw new Error("Falta l’ID de l’allotjament.");
  if (!name) throw new Error("El nom és obligatori.");
  if (!establishment_id) throw new Error("Has de triar un establiment.");

  const supabase = await supabaseAdmin();

  const { error } = await supabase
    .from("accommodations")
    .update({
      name,
      establishment_id,
      capacity,
      base_price,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateAccommodation] error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/allotjaments");
  redirect("/admin/allotjaments");
}
