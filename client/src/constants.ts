export const ROLES = {
  STAFF: "staff",
  CLIENT: "client",
} as const;

export const DEVICE_TYPES = {
  PC: "pc",
  NOTEBOOK: "notebook",
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

export const SERVICE_TYPES = {
  REPAIR: 1,
  MAINTENANCE: 2,
  IT_CONSULTING: 3,
  REMOTE_SUPPORT: 4,
  STRUCTURED_CABLING: 5,
  CAMERA_INSTALLATION: 6,
} as const;

export const ORDER_STATUS = {
  PENDING: 1,
  WAITING: 2,
  IN_PROGRESS: 3,
  CANCELLED: 4,
  FINISHED: 5,
} as const;

export const allowedTransitions: Record<string, string[]> = {
  "1": ["2", "3"],
  "2": ["3", "4"],
  "3": ["5"],
  "4": [],
  "5": [],
};
