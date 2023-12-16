import { clientLoginFormSchema } from "@/pages/login/ClientsLoginForm";
import { loginFormSchema } from "@/pages/login/StaffLoginForm";
import { z } from "zod";

type StaffLoginParams = z.infer<typeof loginFormSchema>;

export async function staffLogin(values: StaffLoginParams) {
  const res = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (res.status === 400) {
    throw new Error(data.message);
  }

  // window.localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function logout() {
  window.localStorage.removeItem("user");
}

type ClientLoginParams = z.infer<typeof clientLoginFormSchema>;

export async function clientLogin(values: ClientLoginParams) {
  const res = await fetch("http://localhost:3000/api/v1/auth/client-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (res.status === 400) {
    throw new Error(data.message);
  }

  // window.localStorage.setItem("user", JSON.stringify(data));
  return data;
}
