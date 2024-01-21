import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const AxiosInterceptor = () => {
  const updateHeader = (request: InternalAxiosRequestConfig) => {
    request.headers = getHeaders() as AxiosRequestHeaders;
    return request;
  };

  api.interceptors.request.use((request) => {
    // if wanted here I could add especial cases for some requests
    // for example: if the request is for assets, I could skip the header update
    // if(request.url?.includes('assets')) {
    //   return request
    // }

    return updateHeader(request);
  });
};

export default api;
