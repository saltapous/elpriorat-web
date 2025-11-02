// app/admin/establishments/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ✅ CREATE
export async function createEstablishment(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const owner_id = formData.get("owner_id")?.toString() || null;
  const town = formData.get("town")?.toString() ?? "";
  const region = formData.get("region")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const website = formData.get("website")?.toString() ?? "";
  const is_active = formData.get("is_active") === "on";

  // 🔒 Validació
  if (!phone.trim()) {
    redirect("/admin/establishments/nou?error=Cal+posar+tel%C3%A8fon");
  }
  if (!email.trim() || !isValidEmail(email)) {
    redirect("/admin/establishments/nou?error=Cal+posar+un+email+v%C3%A0lid");
  }
  if (website.trim() && !isValidUrl(website.trim())) {
    redirect("/admin/establishments/nou?error=La+web+no+%C3%A9s+una+URL+v%C3%A0lida");
  }

  const supabase = supabaseAdmin();

  const { error } = await supabase.from("establishments").insert({
    name,
    owner_id,
    town,
    region,
    phone,
    email,               // 👈👈👈 AIXÒ ÉS EL QUE FALTAVA A LA VERSIÓ VELLA
    website: website || null,
    is_active,
  });

  if (error) {
    console.error("[createEstablishment] error:", error.message);
    redirect("/admin/establishments/nou?error=No+s%27ha+pogut+crear");
  }

  revalidatePath("/admin/establishments");
  redirect("/admin/establishments");
}

// ✅ UPDATE (això ja et funcionava)
export async function updateEstablishment(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    redirect("/admin/establishments?error=Falta+ID");
  }

  const name = formData.get("name")?.toString() ?? null;
  const description = formData.get("description")?.toString() ?? null;
  const address = formData.get("address")?.toString() ?? null;
  const town = formData.get("town")?.toString() ?? null;
  const region = formData.get("region")?.toString() ?? null;
  const phone = formData.get("phone")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const website = formData.get("website")?.toString() ?? "";
  const owner_id = formData.get("owner_id")?.toString() || null;
  const is_active = formData.get("is_active") === "on";

  if (!phone.trim()) {
    redirect(`/admin/establishments/${id}?error=Cal+posar+tel%C3%A8fon`);
  }
  if (!email.trim() || !isValidEmail(email)) {
    redirect(
      `/admin/establishments/${id}?error=Cal+posar+un+email+v%C3%A0lid`
    );
  }
  if (website.trim() && !isValidUrl(website.trim())) {
    redirect(
      `/admin/establishments/${id}?error=La+web+no+%C3%A9s+una+URL+v%C3%A0lida`
    );
  }

  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("establishments")
    .update({
      name,
      description,
      address,
      town,
      region,
      phone,
      email,
      website: website || null,
      owner_id,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateEstablishment] error:", error.message);
    redirect(
      `/admin/establishments/${id}?error=No+s%27ha+pogut+actualitzar`
    );
  }

  revalidatePath("/admin/establishments");
  redirect("/admin/establishments");
}
