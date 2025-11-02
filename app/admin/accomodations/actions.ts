"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function setAccommodationStatus({
  id,
  nextStatus,
}: {
  id: string;
  nextStatus: "draft" | "published" | "archived";
}) {
  const supabase = createServerSupabaseClient();

  // comprovar sessió
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Has de fer login");
  }

  // update
  const { error } = await supabase
    .from("accommodations")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    console.error("Error canviant l'estat:", error);
    throw new Error("No s'ha pogut actualitzar l'estat");
  }

  // tornem a refrescar la llista d'allotjaments
  revalidatePath("/admin/accommodations");
}
