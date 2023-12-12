export type Client = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  province: string;
  address: string;
  phone_number: string;
  postal_code: string;
};

export type CreateClient = Omit<Client, "id">;

export type UpdateClient = Partial<Omit<Client, "id">>;
