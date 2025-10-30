import { redirect } from "next/navigation";
import { supabaseServerRSC } from "@/lib/supabaseServer";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServerRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin");

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </main>
  );
}


