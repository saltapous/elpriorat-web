"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function registerImageForListing({
  listingId,
  storagePath,
  alt,
}: {
  listingId: string;
  storagePath: string;
  alt: string;
}) {
  const supabase = createServerSupabaseClient();

  // 1. Usuari autenticat
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Has de fer login");
  }

  // 2. Inserim la referència a la base de dades
  const { error } = await supabase.from("listing_images").insert([
    {
      listing_id: listingId,
      owner_id: user.id,
      path: storagePath,
      alt,
      is_cover: false,
    },
  ]);

  if (error) {
    console.error("Error inserint listing_images:", error);
    throw new Error("No s'ha pogut registrar la imatge");
  }

  // 3. Tornem a refrescar la pàgina d’imatges perquè es vegi actualitzada
  revalidatePath(`/admin/accommodations/${listingId}/images`);
}

export async function setCoverImage({
  listingId,
  imageId,
}: {
  listingId: string;
  imageId: string;
}) {
  const supabase = createServerSupabaseClient();

  // 1. Usuari autenticat
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Has de fer login");
  }

  // 2. Primer deixem totes les altres imatges com `is_cover = false`
  const { error: clearErr } = await supabase
    .from("listing_images")
    .update({ is_cover: false })
    .eq("listing_id", listingId);

  if (clearErr) {
    console.error("Error netejant covers:", clearErr);
    throw new Error("No s'ha pogut actualitzar la portada");
  }

  // 3. Marquem la triada com a portada
  const { error: coverErr } = await supabase
    .from("listing_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  if (coverErr) {
    console.error("Error marcant cover:", coverErr);
    throw new Error("No s'ha pogut establir la portada");
  }

  revalidatePath(`/admin/accommodations/${listingId}/images`);
}
