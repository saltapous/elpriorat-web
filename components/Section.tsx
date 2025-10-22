type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function Section({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-[1100px] px-6 py-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h3 className="text-xl font-semibold">{title}</h3>
        {subtitle && <p className="mt-1 text-neutral-300">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

