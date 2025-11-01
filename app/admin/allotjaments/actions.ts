"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

export async function createAccommodation(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const capacity = formData.get("capacity")?.toString();
  const base_price = formData.get("base_price")?.toString();
  const establishment_id = formData.get("establishment_id")?.toString();

  if (!name) throw new Error("El nom és obligatori");
  if (!establishment_id) throw new Error("Cal un establiment");

  const slug = slugify(name);
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("accommodations").insert({
    name,
    description: description || null,
    capacity: capacity ? Number(capacity) : null,
    base_price: base_price ? Number(base_price) : null,
    establishment_id,
    slug,
    active: true,
  });

  if (error) {
    console.error("[createAccommodation]", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/allotjaments");
  revalidatePath("/allotjaments");
  redirect("/admin/allotjaments");
}


