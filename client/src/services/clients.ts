import api from "@/services/config";
import { Client, CreateClient, UpdateClient } from "@/types";

export async function getClients() {
  const response = await api.get<Client[]>("/clients");
  return response.data;
}

export async function getClient(id: string) {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
}

export async function createClient(values: CreateClient) {
  const response = await api.post<CreateClient>("/clients", values);
  return response.data;
}

export async function updateClient(id: string, values: UpdateClient) {
  const response = await api.patch<UpdateClient>(`/clients/${id}`, values);
  return response.data;
}

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
}

export async function getProvinces() {
  const response = await api.get("/provinces");
  return response.data.data;
}
