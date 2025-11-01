// app/admin/layout.tsx

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* aquí un dia hi posarem el menú lateral */}
      {children} {/* 👈 IMPORTANTÍSSIM */}
    </div>
  );
}



