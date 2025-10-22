"use client";
import { useState } from "react";

const links = [
  { href: "#rutes", label: "Rutes" },
  { href: "#vins", label: "Vins" },
  { href: "#pobles", label: "Pobles" },
  { href: "#contacte", label: "Contacte" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex h-12 items-center justify-between">
          <a href="/" className="font-semibold tracking-tight">elpriorat.cat</a>

          {/* Desktop */}
          <ul className="hidden gap-6 text-sm md:flex">
            {links.map(l => (
              <li key={l.href}>
                <a className="hover:text-sky-400" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          {/* Mobile button */}
          <button
            aria-label="Obre menú"
            onClick={() => setOpen(v => !v)}
            className="md:hidden rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/5"
          >
            {open ? "Tanca" : "Menú"}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-neutral-950/95">
          <ul className="mx-auto max-w-6xl px-4 py-3 space-y-2">
            {links.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block rounded-lg px-3 py-2 hover:bg-white/5 hover:text-sky-400"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}


