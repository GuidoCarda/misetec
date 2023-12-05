import { loginFormSchema } from "@/pages/login/StaffLoginForm";
import { z } from "zod";

type LoginParams = z.infer<typeof loginFormSchema>;

export async function login(values: LoginParams) {
  const res = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (res.status === 400) {
    throw new Error("Credeniales invalidas");
  }

  const data = await res.json();

  window.localStorage.setItem("user", JSON.stringify(data));
  return data;
}
