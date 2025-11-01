"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function createOwner(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  if (!name) {
    throw new Error("El nom és obligatori");
  }

  const supabase = supabaseAdmin(); // 👈 ara sí: service role i sense cookies

  const { error } = await supabase.from("owners").insert({
    name,
    email: email || null,
    phone: phone || null,
  });

  if (error) {
    console.error("[createOwner]", error);
    throw new Error(error.message);
  }

  // refresquem llistats que en un futur tindrem
  revalidatePath("/admin/owners");
  revalidatePath("/admin/establishments/nou");

  // si no tens /admin/owners encara, redirigeix a /admin
  redirect("/admin/owners");
}
