function Card(props: { id?: string; title: string; desc: string; href?: string }) {
  const Wrapper: any = props.href ? "a" : "div";
  return (
    <Wrapper
      id={props.id}
      href={props.href}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.08] hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold tracking-tight group-hover:text-sky-400">
        {props.title}
      </h3>
      <p className="mt-2 text-neutral-300">{props.desc}</p>
      {props.href && (
        <span className="mt-4 inline-block text-sm text-sky-400 underline-offset-2 group-hover:underline">
          Explora
        </span>
      )}
    </Wrapper>
  );
}

export default function Page() {
  return (
    <>
      {/* HERO amb imatge i gradient */}
      <section className="relative isolate">
        {/* Imatge de fons */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/hero-priorat.jpg"
            alt="Vinyes del Priorat amb muntanyes de fons"
            className="h-full w-full object-cover"
          />
          {/* Gradient per millorar llegibilitat */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-neutral-950/90" />
        </div>

        {/* Text principal */}
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Benvinguts al Priorat
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-200">
            Guia moderna per descobrir camins, cellers i paisatges.
            Contingut curat, rutes i agenda local.
          </p>
          <div className="mt-8">
            <a
              href="#vins"
              className="inline-block rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Explora vins i cellers
            </a>
          </div>
        </div>
      </section>

      {/* GRID seccions principals */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            id="rutes"
            title="Rutes a peu"
            desc="GR, camins històrics i senders entre vinyes."
            href="#rutes-detall"
          />
          <Card
            id="vins"
            title="Vins i cellers"
            desc="DOQ Priorat i DO Montsant: mapes i visites."
            href="#vins-detall"
          />
          <Card
            id="pobles"
            title="Pobles"
            desc="Fitxes breus: història, què veure i on menjar."
            href="#pobles-detall"
          />
        </div>
      </section>

      {/* BLOCS DE DETALL */}
      <section
        id="rutes-detall"
        className="mx-auto max-w-6xl px-4 py-12 border-t border-white/10"
      >
        <h2 className="text-2xl font-semibold">Rutes</h2>
        <p className="mt-2 text-neutral-300">
          Pròximament: rutes a peu i en bici amb mapa i GPX.
        </p>
      </section>

      <section
        id="vins-detall"
        className="mx-auto max-w-6xl px-4 py-12 border-t border-white/10"
      >
        <h2 className="text-2xl font-semibold">Vins i cellers</h2>
        <p className="mt-2 text-neutral-300">
          Mapa de cellers, visites i tastos organitzats.
        </p>
      </section>

      <section
        id="pobles-detall"
        className="mx-auto max-w-6xl px-4 py-12 border-t border-white/10"
      >
        <h2 className="text-2xl font-semibold">Pobles</h2>
        <p className="mt-2 text-neutral-300">
          Fitxes amb història, llocs d’interès i on menjar/dormir.
        </p>
      </section>

      {/* CONTACTE */}
      <section id="contacte" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Contacte</h2>
        <p className="mt-2 text-neutral-300">
          Tens una ruta o un celler per proposar? Escriu-nos:{" "}
          <a
            href="mailto:hello@elpriorat.cat"
            className="text-sky-400 hover:underline"
          >
            hello@elpriorat.cat
          </a>
        </p>
      </section>
    </>
  );
}








