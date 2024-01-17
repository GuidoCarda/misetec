import api from "@/services/config";
import { StaffMember } from "@/types";

export async function createStaffAccount(values: Record<string, unknown>) {
  const response = await api.post("/auth/signup", values);
  return response.data;
}

export async function getStaffMembers() {
  const response = await api.get<StaffMember[]>("/auth/staff");
  return response.data;
}
