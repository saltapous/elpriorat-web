"use client";

import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type AccommodationRow = {
  id: string
  name: string
  cover_image: string | null
  base_price_per_night: number
  capacity: number
  establishment: {
    town: string | null
    name: string
  } | null
  rate: {
    price_per_night: number | null
  } | null
}

async function getAccommodations(): Promise<AccommodationRow[]> {
  const { data, error } = await supabase
    .from('accommodations')
    .select(`
      id,
      name,
      cover_image,
      base_price_per_night,
      capacity,
      establishment:establishments (
        name,
        town
      ),
      rate:rates (
        price_per_night
      )
    `)
    .limit(50)

  if (error) {
    console.error('Error fetching accommodations:', error)
    return []
  }

  const normalized = (data || []).map((row: any) => {
    const rateField = Array.isArray(row.rate) ? row.rate[0] : row.rate
    return {
      ...row,
      rate: rateField || null,
    }
  })

  return normalized as AccommodationRow[]
}

export default async function AllotjamentsPage() {
  const accommodations = await getAccommodations()

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-gray-100">
          On dormir al Priorat
        </h1>
        <p className="text-gray-400 mt-2">
          Cases rurals, bungalous, habitacions amb vistes, allotjaments únics.
        </p>
      </header>

      {accommodations.length === 0 ? (
        <p className="text-center text-gray-500">
          Encara no hi ha allotjaments disponibles.
        </p>
      ) : (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
          {accommodations.map((acc) => {
            const town = acc.establishment?.town || '—'
            const fromPrice =
              acc.rate?.price_per_night ??
              acc.base_price_per_night ??
              null

            return (
              <Link
                key={acc.id}
                href={`/allotjaments/${acc.id}`}
                className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-800 bg-white text-gray-900 shadow-sm hover:shadow-lg transition-shadow block"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  {acc.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={acc.cover_image}
                      alt={acc.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm">
                      (Sense imatge)
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                    {acc.name}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2">{town}</p>

                  <p className="text-sm text-gray-600">
                    Capacitat: {acc.capacity}{' '}
                    {acc.capacity === 1 ? 'persona' : 'persones'}
                  </p>

                  {fromPrice !== null && (
                    <p className="mt-4 text-base font-medium text-gray-900">
                      des de {fromPrice} € / nit
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </main>
  )
}
