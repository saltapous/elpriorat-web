"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

export async function createEstablishment(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const owner_id = formData.get("owner_id")?.toString() ?? "";
  const town = formData.get("town")?.toString().trim() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const website = formData.get("website")?.toString().trim() ?? "";

  if (!name) throw new Error("El nom és obligatori");
  if (!owner_id) throw new Error("Cal un propietari");

  const slug = slugify(name);
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("establishments").insert({
    owner_id,
    name,
    slug,
    town: town || null,
    region: region || null,
    address: address || null,
    phone: phone || null,
    website: website || null,
  });

  if (error) {
    console.error("[createEstablishment]", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/establishments");
  revalidatePath("/admin/allotjaments/nou");
  redirect("/admin/establishments");
}


