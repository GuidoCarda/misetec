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
  created_at: string;
  finished_at: string | null;
  description: string;
  device_failure: string;
  accesories: string;
  report: string;
  service_type_id: number;
  service_type?: string;
  status_id: number;
  status?: string;
  device_id: number;
  client_id: number;
  staff_id: number;
};

export type CreateOrder = {
  client_id: number;
  description: string;
  service_type_id: number;
  accesories?: string | undefined;
  type?: string | undefined;
  brand?: string | undefined;
  model?: string | undefined;
  serial_number?: string | undefined;
};

export type UpdateOrder = Partial<Omit<Order, "id" | "created_at">>;

export type OrderWithClientDetails = Order &
  Partial<Client> & { province: string } & Partial<Device>;

export type OrderStatus = {
  id: number;
  denomination: string;
};

export type Device = {
  id: number;
  type: "pc" | "notebook";
  brand: string;
  model: string;
  serial_number: string;
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

export type StaffMember = {
  id: number;
  firstname: string;
  lastname: string;
  password?: string;
  email: string;
  status: number;
};
