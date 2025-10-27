"use client";

import { useState } from "react";

export default function ReservaForm({
  maxPlaces,
}: {
  maxPlaces: number;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [places, setPlaces] = useState(2);
  const [notes, setNotes] = useState("");

  return (
    <form className="space-y-4 text-sm text-neutral-200">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-neutral-400 mb-1">Entrada</span>
          <input
            type="date"
            className="bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-neutral-400 mb-1">Sortida</span>
          <input
            type="date"
            className="bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>
      </div>

      <label className="flex flex-col">
        <span className="text-neutral-400 mb-1">
          Places (màx. {maxPlaces})
        </span>
        <input
          type="number"
          min={1}
          max={maxPlaces}
          className="bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
          value={places}
          onChange={(e) => setPlaces(Number(e.target.value))}
        />
      </label>

      <label className="flex flex-col">
        <span className="text-neutral-400 mb-1">Comentaris</span>
        <textarea
          className="bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500 resize-none min-h-[70px]"
          placeholder="Som una parella amb gos petit, accepteu mascotes?... "
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-neutral-900 font-semibold rounded-lg py-2 transition"
      >
        Demana disponibilitat
      </button>

      <p className="text-[11px] text-neutral-500 text-center leading-snug">
        Això NO fa reserva automàtica. Enviarem la teva sol·licitud directament
        als propietaris i et respondran per WhatsApp o email.
      </p>
    </form>
  );
}
