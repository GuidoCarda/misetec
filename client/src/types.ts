export type DecodedToken = {
  id: number;
  email: string;
  iat: number;
};

export type User = {
  token: string;
  role: string;
  userId: number;
};

export type Client = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  province_id: number;
  address: string;
  phone_number: string;
  postal_code: string;
};

export type CreateClient = Omit<Client, "id">;

export type UpdateClient = Partial<Omit<Client, "id">>;

export type Order = {
  id: number;
  description: string;
  accesories?: string;
  service_type_id: number;
  client_id: number;
  device_id: number;
  status_id: number;
  created_at: string;
  status?: string;
  service_type?: string;
};

export type OrderWithClient = Order & Partial<Client>;

export type CreateOrder = Omit<Order, "id" | "created_at">;

export type OrderStatus = {
  id: number;
  denomination: string;
};

export type ServiceType = {
  id: number;
  denomination: string;
  description: string;
};

export type Province = {
  id: number;
  denomination: string;
};
