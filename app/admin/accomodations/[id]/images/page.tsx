import { createServerSupabaseClient } from "@/lib/supabaseServer";
import ImageUploader from "./ImageUploader";
import { setCoverImage } from "./actions";

type Props = {
  params: { id: string };
};

export default async function ImagesPage({ params }: Props) {
  const listingId = params.id;
  const supabase = createServerSupabaseClient();

  // 1. Busquem info bàsica de l'allotjament
  const { data: accommodation, error: accError } = await supabase
    .from("accommodations")
    .select("id, name")
    .eq("id", listingId)
    .single();

  if (accError || !accommodation) {
    // Si no existeix o no tens permís per veure'l (RLS), mostrem error amable
    return (
      <div className="text-red-400 text-sm">
        No s'ha trobat aquest allotjament o no tens accés.
      </div>
    );
  }

  // 2. Llistem les imatges d'aquest allotjament
  const { data: images, error: imgError } = await supabase
    .from("listing_images")
    .select("id, path, alt, is_cover, created_at")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (imgError) {
    console.error("Error fetching listing_images:", imgError);
  }

  // 3. Necessitem poder construir la URL pública de la imatge
  //    Si el bucket 'listing-images' és públic -> publicURL = supabase.storage...getPublicUrl
  //    Això és server-side però neutre, no toca dades sensibles.
  const urls: Record<string, string> = {};
  if (images && images.length > 0) {
    const storage = supabase.storage.from("listing-images");
    for (const img of images) {
      const { data: publicUrlData } = storage.getPublicUrl(img.path);
      urls[img.id] = publicUrlData.publicUrl;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Imatges de {accommodation.name}
          </h1>
          <p className="text-sm text-neutral-400">
            Puja fotos de l'allotjament, marca quina és la portada i ordena-les.
          </p>
        </div>

        <a
          href="/admin/accommodations"
          className="text-sm text-neutral-400 hover:text-neutral-200 transition text-center px-3 py-2"
        >
          ← Tornar als allotjaments
        </a>
      </div>

      {/* Uploader */}
      <ImageUploader listingId={listingId} />

      {/* Galeria */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {images && images.length > 0 ? (
          images.map((img) => (
            <div
              key={img.id}
              className="relative rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 flex flex-col gap-2"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                {urls[img.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[img.id]}
                    alt={img.alt || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-neutral-500">
                    (sense previsualització)
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between text-xs">
                <div className="text-neutral-300 truncate max-w-[70%] leading-tight">
                  {img.alt || "—"}
                </div>

                {img.is_cover ? (
                  <span className="inline-flex items-center rounded-md bg-white text-neutral-900 border border-white px-2 py-1 text-[10px] font-medium">
                    Portada
                  </span>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await setCoverImage({
                        listingId,
                        imageId: img.id,
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-neutral-600 text-neutral-300 hover:text-white hover:border-white px-2 py-1 text-[10px] font-medium"
                    >
                      Fer portada
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">
            Encara no hi ha imatges per aquest allotjament.
          </p>
        )}
      </div>
    </div>
  );
}
