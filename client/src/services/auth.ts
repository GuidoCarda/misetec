import { clientLoginFormSchema } from "@/pages/login/ClientsLoginForm";
import { loginFormSchema } from "@/pages/login/StaffLoginForm";
import api from "@/services/config";
import { z } from "zod";

type StaffLoginParams = z.infer<typeof loginFormSchema>;
type ClientLoginParams = z.infer<typeof clientLoginFormSchema>;

export async function staffLogin(values: StaffLoginParams) {
  const response = await api.post("/auth/login", values);
  return response.data;
}

export async function logout() {
  window.localStorage.removeItem("user");
}

export async function clientLogin(values: ClientLoginParams) {
  const response = await api.post("/auth/client-login", values);
  return response.data;
}

export async function clientLoginConfirmation(values: { otp: string }) {
  const response = await api.post("/auth/client-otp", values);
  return response.data;
}

export async function deleteStaffMember(id: string) {
  const response = await api.delete(`/auth/staff/${id}`);
  return response.data;
}
