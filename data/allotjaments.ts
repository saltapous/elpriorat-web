// data/allotjaments.ts

export type Unit = {
  id: string;
  name: string;
  shortDescription: string;
  capacity: number; // persones
  pricePerNight: number; // €
  images: string[]; // routes a /public
  available: boolean; // placeholder per quan fem calendari
};

export type Allotjament = {
  name: string;
  slug: string;
  tipus: string;
  poble: string;
  descripcioLlarga: string;
  coverImage: string;
  units: Unit[];
};

export const allotjaments: Allotjament[] = [
  {
    name: "Casa del Montsant",
    slug: "casa-del-montsant",
    tipus: "Casa rural",
    poble: "La Morera de Montsant",
    descripcioLlarga:
      "Casa rural acollidora al cor del Montsant. Ideal per relaxar-se, fer senderisme i gaudir del vi del Priorat.",
    coverImage: "/hero-priorat.jpg",
    units: [
      {
        id: "unit-1",
        name: "Habitació doble amb vistes",
        shortDescription:
          "Llit doble, bany privat, vistes a la serra del Montsant.",
        capacity: 2,
        pricePerNight: 140,
        images: ["/hero-priorat.jpg"],
        available: true,
      },
      {
        id: "unit-2",
        name: "Casa sencera (4 persones)",
        shortDescription:
          "Casa completa amb cuina equipada i terrassa exterior.",
        capacity: 4,
        pricePerNight: 220,
        images: ["/hero-priorat.jpg"],
        available: false,
      },
    ],
  },

  // Aquí podem afegir més allotjaments en el futur.
  // {
  //   name: "Hotel Prior Terra",
  //   slug: "hotel-prior-terra",
  //   tipus: "Hotel rural",
  //   poble: "Gratallops",
  //   descripcioLlarga:
  //     "Hotel rural en plena ruta del vi. Habitacions modernes i esmorzar inclòs.",
  //   coverImage: "/hotel-prior-terra.jpg",
  //   units: [...],
  // },
];
