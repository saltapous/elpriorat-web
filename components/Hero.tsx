export default function Hero() {
  return (
    <header className="mx-auto max-w-[1100px] px-6 py-16 text-center">
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        Benvinguts al Priorat
      </h1>
      <p className="mx-auto max-w-2xl text-neutral-300">
        Una guia senzilla i moderna per descobrir camins, cellers i paisatges.
        Contingut curat, rutes descarregables i agenda local.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a href="#rutes" className="rounded-xl px-4 py-2 font-medium text-white
          bg-gradient-to-tr from-fuchsia-500 to-rose-500">
          Explora rutes
        </a>
        <a href="#vins" className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2">
          Vins i cellers
        </a>
      </div>
    </header>
  );
}

