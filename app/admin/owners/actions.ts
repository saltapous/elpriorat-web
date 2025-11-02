// app/admin/owners/actions.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function createOwner(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const is_active = formData.get("is_active") === "on";

  if (!name) throw new Error("El nom és obligatori");

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("owners")
    .insert({ name, email, phone, is_active })
    .select("id")
    .single();

  if (error) {
    console.error("[createOwner]", error);
    throw new Error(error.message);
  }

  // si el crees ja inactiu, cascada cap avall
  if (!is_active && data?.id) {
    await supabase.from("establishments").update({ is_active: false }).eq("owner_id", data.id);
    await supabase
      .from("accommodations")
      .update({ is_active: false })
      .in(
        "establishment_id",
        (
          await supabase
            .from("establishments")
            .select("id")
            .eq("owner_id", data.id)
        ).data?.map((e) => e.id) ?? []
      );
  }

  redirect("/admin/owners");
}

export async function updateOwner(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const is_active = formData.get("is_active") === "on";

  if (!id) throw new Error("Falta l'id del propietari");
  if (!name) throw new Error("El nom és obligatori");

  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("owners")
    .update({ name, email, phone, is_active })
    .eq("id", id);

  if (error) {
    console.error("[updateOwner]", error);
    throw new Error(error.message);
  }

  // cascada activació/desactivació
  if (is_active === false) {
    // owner OFF → tot OFF
    const { data: estabs } = await supabase
      .from("establishments")
      .update({ is_active: false })
      .eq("owner_id", id)
      .select("id");

    const estabIds = estabs?.map((e) => e.id) ?? [];

    if (estabIds.length) {
      await supabase.from("accommodations").update({ is_active: false }).in("establishment_id", estabIds);
    }
  } else {
    // owner ON → només ON els establiments + allotjaments d'aquest
    const { data: estabs } = await supabase
      .from("establishments")
      .update({ is_active: true })
      .eq("owner_id", id)
      .select("id");

    const estabIds = estabs?.map((e) => e.id) ?? [];

    if (estabIds.length) {
      await supabase.from("accommodations").update({ is_active: true }).in("establishment_id", estabIds);
    }
  }

  redirect("/admin/owners");
}




