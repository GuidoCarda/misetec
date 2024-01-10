export const getHeaders = (): {
  "Content-Type": string;
  Authorization?: string;
} => {
  const authInfo = JSON.parse(localStorage.getItem("user") || "{}");
  const { role, token } = authInfo;

  if (role && token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
};

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: getHeaders(),
});

export default api;
