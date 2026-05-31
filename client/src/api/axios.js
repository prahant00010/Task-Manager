import axios from "axios";

function resolveBaseURL() {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (!envUrl) return "/api";
  return envUrl.replace(/\/+$/, "");
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error(
          "Cannot reach API server. Start the backend (npm run dev in server/) and ensure MongoDB is running."
        )
      );
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Request failed";

    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthRoute =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/signup");
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
