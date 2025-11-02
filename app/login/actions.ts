// app/login/actions.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseServerForActions } from "@/lib/supabaseServer";

export type ActionResult = {
  error?: string;
};

export async function loginAction(formData: FormData): Promise<ActionResult> {
  // 👇 ara sí: formData existeix
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Cal posar email i contrasenya." };
  }

  const supabase = await supabaseServerForActions();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // si tot va bé → cap a l'admin
  redirect("/admin");
}

