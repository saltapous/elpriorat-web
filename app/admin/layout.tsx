// app/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-800">
        <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center gap-8">
          <Link href="/admin/allotjaments" className="text-sky-400 hover:underline">
            Allotjaments
          </Link>
          <Link href="/admin/establishments" className="text-sky-400 hover:underline">
            Establiments
          </Link>
          <Link href="/admin/owners" className="text-sky-400 hover:underline">
            Propietaris
          </Link>
          <Link href="/admin/settings" className="text-sky-400 hover:underline">
            Configuració
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </>
  );
}











