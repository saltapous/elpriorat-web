"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD") // treure accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createAccommodation(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Has de fer login");
  }

  const establishment_id = String(formData.get("establishment_id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const capacityRaw = formData.get("capacity");
  const basePriceRaw = formData.get("base_price");
  const description = String(formData.get("description") || "").trim();
  const servicesRaw = String(formData.get("services") || "").trim();

  const capacity = capacityRaw ? Number(capacityRaw) : 2;
  const base_price = basePriceRaw ? Number(basePriceRaw) : 0;

  const services =
    servicesRaw.length > 0
      ? servicesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  if (!name) throw new Error("El camp 'Nom de l’allotjament' és obligatori");
  if (!establishment_id) throw new Error("Has de triar un establiment");
  if (!type) throw new Error("Has d'indicar el tipus");

  // generem slug base
  const baseSlug = slugify(name);

  // comprovem si ja existeix
  const { data: existing } = await supabase
    .from("accommodations")
    .select("slug")
    .ilike("slug", `${baseSlug}%`);

  let finalSlug = baseSlug;
  if (existing && existing.length > 0) {
    // si hi ha col·lisions, afegim sufix incremental
    let i = 2;
    const used = new Set(existing.map((e) => e.slug));
    while (used.has(finalSlug)) {
      finalSlug = `${baseSlug}-${i}`;
      i++;
    }
  }

  const { error } = await supabase
    .from("accommodations")
    .insert([
      {
        owner_id: user.id,
        establishment_id,
        name,
        slug: finalSlug,
        type,
        capacity,
        base_price,
        description,
        services,
        status: "draft",
      },
    ]);

  if (error) {
    console.error("Error inserint accommodation:", error);
    throw new Error("No s'ha pogut crear l'allotjament");
  }

  redirect("/admin/accommodations");
}
