"use server";

import { revalidatePath } from "next/cache";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

type CreateReservationInput = {
  accommodationId: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  guests: number;
  totalPrice: number; // en euros
};

export async function createReservation(input: CreateReservationInput) {
  const supabase = await supabaseServerReadOnly();

  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) throw new Error("Has d'iniciar sessió");

  const payload = {
    accommodation_id: input.accommodationId,
    user_id: user.id,
    start_date: input.startDate,
    end_date: input.endDate,
    guests: input.guests,
    total_price: input.totalPrice,
    // commission_rate/amount es calcularan al trigger
  };

  const { data, error } = await supabase
    .from("reservations")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/reservas"); // ajusta el path de la teva UI
  return data.id as string;
}

export async function cancelMyReservation(reservationId: string) {
  const supabase = await supabaseServerReadOnly();

  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) throw new Error("Has d'iniciar sessió");

  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/reservas");
}

export async function ownerSetReservationStatus(reservationId: string, status: "confirmed" | "cancelled") {
  // L’RLS + trigger ja validen que només l’owner/admin puguin confirmar/cancel·lar
  const supabase = await supabaseServerReadOnly();

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId);

  if (error) throw error;

  revalidatePath("/admin/reservas");
}
