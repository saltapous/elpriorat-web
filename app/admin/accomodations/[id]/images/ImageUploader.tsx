"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { registerImageForListing } from "./actions";

type Props = {
  listingId: string;
};

export default function ImageUploader({ listingId }: Props) {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!file) {
      setErrorMsg("Selecciona una imatge");
      return;
    }

    setUploading(true);

    // 1. Generem una ruta única dins el bucket.
    // Exemple: listingId/nomOriginal-timestamp.jpg
    const fileExt = file.name.split(".").pop();
    const fileName = `${listingId}-${Date.now()}.${fileExt}`;
    const filePath = `${listingId}/${fileName}`;

    // 2. Pugem la imatge al bucket 'listing-images'
    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      setErrorMsg("Error pujant la imatge");
      setUploading(false);
      return;
    }

    // 3. Guardem el registre a la base de dades (Server Action)
    await registerImageForListing({
      listingId,
      storagePath: filePath,
      alt,
    });

    // 4. Reset del formulari
    setFile(null);
    setAlt("");
    setUploading(false);
  }

  return (
    <form
      onSubmit={handleUpload}
      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex flex-col gap-4 max-w-md"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-200 font-medium">
          Selecciona una imatge
        </label>
        <input
          type="file"
          accept="image/*"
          className="text-sm text-neutral-300"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
        <p className="text-[11px] text-neutral-500">
          JPG/PNG recomanat. Mida màxima raonable (p.ex. 4-5MB).
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-200 font-medium">
          Alt / descripció breu
        </label>
        <input
          className="rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-neutral-100 text-sm outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Habitació doble amb vistes al Montsant"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="self-start rounded-lg bg-white text-neutral-900 text-sm font-medium px-4 py-2 hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {uploading ? "Pujant..." : "Pujar imatge"}
      </button>
    </form>
  );
}
