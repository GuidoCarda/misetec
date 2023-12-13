import { CreateClient, UpdateClient } from "@/types";

export async function getClients() {
  const res = await fetch("http://localhost:3000/api/v1/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getClient(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/clients/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(data.message);
    throw new Error(data.message);
  }

  return data;
}

export async function createClient(values: CreateClient) {
  const res = await fetch("http://localhost:3000/api/v1/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function updateClient(id: string, values: UpdateClient) {
  const res = await fetch(`http://localhost:3000/api/v1/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteClient(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/clients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}
