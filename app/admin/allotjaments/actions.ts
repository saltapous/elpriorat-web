// app/admin/allotjaments/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

export async function createAccommodation(formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || null;
  const establishment_id = formData.get("establishment_id")?.toString() || null;
  const capacity = Number(formData.get("capacity") || 0);
  const base_price = Number(formData.get("base_price") || 0);
  const is_active = formData.get("is_active") ? true : false;

  if (!name) {
    throw new Error("El nom és obligatori");
  }
  if (!establishment_id) {
    throw new Error("Cal triar un establiment");
  }

  const supabase = supabaseAdmin();

  const { error } = await supabase.from("accommodations").insert({
    name,
    description,
    establishment_id,
    capacity,
    base_price,
    is_active,
    slug: slugify(name),
  });

  if (error) {
    console.error("[createAccommodation]", error);
    throw new Error(error.message);
  }

  // tornem a carregar el llistat
  revalidatePath("/admin/allotjaments");
  redirect("/admin/allotjaments");
}



