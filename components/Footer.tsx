export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-5">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 text-sm text-neutral-400">
        <span>© {new Date().getFullYear()} elpriorat.cat</span>
        <a href="#contacte" className="hover:text-neutral-200">Contacte</a>
      </div>
    </footer>
  );
}

