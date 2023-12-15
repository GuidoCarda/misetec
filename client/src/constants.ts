export const provinces = [
  {
    id: "BA",
    name: "Buenos Aires",
  },
  {
    id: "CA",
    name: "Catamarca",
  },
  {
    id: "CH",
    name: "Chaco",
  },
  {
    id: "CT",
    name: "Chubut",
  },
  {
    id: "CB",
    name: "Córdoba",
  },
  {
    id: "CR",
    name: "Corrientes",
  },
  {
    id: "ER",
    name: "Entre Ríos",
  },
  {
    id: "FO",
    name: "Formosa",
  },
  {
    id: "JY",
    name: "Jujuy",
  },
  {
    id: "LP",
    name: "La Pampa",
  },
  {
    id: "LR",
    name: "La Rioja",
  },
  {
    id: "MZA",
    name: "Mendoza",
  },
  {
    id: "MI",
    name: "Misiones",
  },
  {
    id: "NQN",
    name: "Neuquén",
  },
  {
    id: "RN",
    name: "Río Negro",
  },
  {
    id: "SA",
    name: "Salta",
  },
  {
    id: "SJ",
    name: "San Juan",
  },
  {
    id: "SL",
    name: "San Luis",
  },
  {
    id: "SC",
    name: "Santa Cruz",
  },
  {
    id: "SF",
    name: "Santa Fe",
  },
  {
    id: "SE",
    name: "Santiago del Estero",
  },
  {
    id: "TF",
    name: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  },
  {
    id: "TUC",
    name: "Tucumán",
  },
];

export const orderStatuses = [
  {
    id: 1,
    denomination: "pendiente",
  },
  {
    id: 2,
    denomination: "en espera",
  },
  {
    id: 3,
    denomination: "en progreso",
  },
  {
    id: 4,
    denomination: "cancelada",
  },
  {
    id: 5,
    denomination: "finalizada",
  },
];

export const allowedTransitions: Record<string, string[]> = {
  "1": ["2", "3"],
  "2": ["3", "4"],
  "3": ["5"],
  "4": [],
  "5": [],
};
