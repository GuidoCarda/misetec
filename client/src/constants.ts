export const ROLES = {
  staff: "staff",
  client: "client",
} as const;

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
