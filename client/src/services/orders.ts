import { getHeaders } from "./config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getOrders() {
  const headers = getHeaders();
  console.log(headers);
  const res = await fetch("http://localhost:3000/api/v1/orders", {
    method: "GET",
    headers,
  });

  const data = await res.json();
  return data;
}

export async function getOrder(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

export async function createOrder(values: any) {
  const res = await fetch("http://localhost:3000/api/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  return data;
}

export async function updateOrder(id: string, values: any) {
  const res = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  return data;
}

export async function deleteOrder(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const values = {
    status_id: status,
  };

  const res = await fetch(`http://localhost:3000/api/v1/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  return data;
}

export async function getOrderStatusList() {
  const res = await fetch(`http://localhost:3000/api/v1/order-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

export async function getOrdersByClientId(id: string) {
  const headers = getHeaders();
  console.log(headers);

  const res = await fetch(
    `http://localhost:3000/api/v1/orders?client_id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  return data.data;
}
