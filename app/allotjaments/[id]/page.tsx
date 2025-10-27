import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type AccommodationDetail = {
  id: string
  name: string
  description: string | null
  capacity: number
  bedrooms: number | null
  bathrooms: number | null
  size_m2: number | null
  base_price_per_night: number | null
  cover_image: string | null
  images: string[] | null
  house_rules: string | null
  establishment: {
    name: string
    town: string | null
    region: string | null
  } | null
}

async function getAccommodation(id: string): Promise<AccommodationDetail | null> {
  const { data, error } = await supabase
    .from('accommodations')
    .select(`
      id,
      name,
      description,
      capacity,
      bedrooms,
      bathrooms,
      size_m2,
      base_price_per_night,
      cover_image,
      images,
      house_rules,
      establishment:establishments (
        name,
        town,
        region
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching accommodation detail:', error)
    return null
  }

  return data as AccommodationDetail
}

export default async function AccommodationDetailPage(
  props: { params: { id: string } }
) {
  // ✅ aquí desestructurem i fem servir directament props.params
  const { id } = props.params

  const acc = await getAccommodation(id)

  if (!acc) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-200">
        <p className="text-xl font-semibold mb-4">
          No s’ha trobat aquest allotjament.
        </p>
        <Link
          href="/allotjaments"
          className="text-emerald-400 hover:underline"
        >
          ← Tornar als allotjaments
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-neutral-100">
      {/* Tornar enrere */}
      <div className="mb-6 text-sm">
        <Link
          href="/allotjaments"
          className="text-emerald-400 hover:underline"
        >
          ← Tornar als allotjaments
        </Link>
      </div>

      {/* Títol i info bàsica */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          {acc.name}
        </h1>

        <p className="text-neutral-400 mt-2">
          {acc.establishment?.town
            ? `${acc.establishment.town}${
                acc.establishment?.region
                  ? ', ' + acc.establishment.region
                  : ''
              }`
            : ''}
        </p>

        {acc.base_price_per_night !== null && (
          <p className="text-lg text-white font-medium mt-4">
            des de {acc.base_price_per_night} € / nit
          </p>
        )}
      </header>

      {/* Imatge principal */}
      <section className="mb-10">
        <div className="relative w-full overflow-hidden rounded-xl bg-neutral-800 min-h-[240px] sm:min-h-[360px]">
          {acc.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={acc.cover_image}
              alt={acc.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
              (Sense imatge principal)
            </div>
          )}
        </div>
      </section>

      {/* Descripció i dades pràctiques */}
      <section className="grid gap-10 sm:grid-cols-2 mb-12">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Descripció
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
            {acc.description || 'Sense descripció.'}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-3">
            Normes de la casa
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
            {acc.house_rules || 'Sense normes específiques.'}
          </p>
        </div>

        <aside className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 text-sm text-neutral-300">
          <h2 className="text-white font-semibold text-lg mb-4">
            Dades pràctiques
          </h2>

          <ul className="space-y-2">
            <li>
              <span className="text-neutral-500">Capacitat:</span>{' '}
              {acc.capacity}{' '}
              {acc.capacity === 1 ? 'persona' : 'persones'}
            </li>

            {acc.bedrooms !== null && (
              <li>
                <span className="text-neutral-500">Habitacions:</span>{' '}
                {acc.bedrooms}
              </li>
            )}

            {acc.bathrooms !== null && (
              <li>
                <span className="text-neutral-500">Banys:</span>{' '}
                {acc.bathrooms}
              </li>
            )}

            {acc.size_m2 !== null && (
              <li>
                <span className="text-neutral-500">Superfície:</span>{' '}
                {acc.size_m2} m²
              </li>
            )}

            <li>
              <span className="text-neutral-500">Preu base:</span>{' '}
              {acc.base_price_per_night ?? '—'} € / nit
            </li>
          </ul>
        </aside>
      </section>

      {/* Galeria secundària */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-white mb-4">
          Galeria
        </h2>

        {acc.images && acc.images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acc.images.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl bg-neutral-800 min-h-[160px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${acc.name} foto ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">
            Sense imatges addicionals.
          </p>
        )}
      </section>

      {/* Placeholder reserva futura */}
      <section className="text-center text-neutral-400 text-sm">
        <p>Aviat: calendari de disponibilitat i sol·licitud de reserva ✨</p>
      </section>
    </main>
  )
}
