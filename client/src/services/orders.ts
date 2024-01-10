import {
  CreateOrder,
  Order,
  OrderStatus,
  OrderWithClientDetails,
  UpdateOrder,
} from "@/types";
import api, { getHeaders } from "./config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getOrders() {
  const response = await api.get<{ data: OrderWithClientDetails[] }>("/orders");
  return response.data.data;
}

export async function getOrder(id: string) {
  const response = await api.get<OrderWithClientDetails>(`/orders/${id}`);
  return response.data;
}

export async function createOrder(values: CreateOrder) {
  const response = await api.post<Order>(`/orders`, values);
  return response.data;
}

export async function updateOrder(id: string, values: UpdateOrder) {
  const response = await api.patch(`/orders/${id}`, values);
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string, status: string) {
  const values = {
    status_id: status,
  };
  const response = await api.patch(`/orders/${id}/status`, values);
  return response.data;
}

export async function getOrderStatusList() {
  const response = await api.get<OrderStatus[]>(`/order-status`);
  return response.data;
}

export async function getOrdersByClientId(id: string) {
  const headers = getHeaders();

  const res = await fetch(
    `http://localhost:3000/api/v1/orders?client_id=${id}`,
    {
      method: "GET",
      headers,
    }
  );

  const data = await res.json();
  return data.data;
}
