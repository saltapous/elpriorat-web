import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = { title: "elpriorat.cat", description: "Guia del Priorat" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca" className="scroll-smooth">
      <body className="min-h-dvh bg-neutral-950 text-neutral-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400">
            © {new Date().getFullYear()} elpriorat.cat
          </div>
        </footer>
      </body>
    </html>
  );
}




