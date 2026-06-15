export const API_BASE_URL = "https://api-gateway-px44.onrender.com/api/";

// export const API_BASE_URL = "http://localhost:8082/api/";

import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Si el error no es 401, o si ya reintentamos y volvió a fallar, fuera.
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 2. Si es el endpoint de refresh el que da 401, NO REINTENTAR.
    // Limpiar todo e ir al login.
    if (
      originalRequest.url?.includes("/api/auth/refresh") ||
      originalRequest.url?.includes("/api/auth/login")
    ) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken: storedRefreshToken, login } =
        useAuthStore.getState();

      const res = await axios.post(
        "https://api-gateway-px44.onrender.com/api/auth/refresh",
        { refreshToken: storedRefreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      // --- CRÍTICO: Verifica los nombres exactos de tu AuthResponse de Java ---
      const newToken = res.data.accessToken || res.data.token;
      const newRefresh = res.data.refreshToken;

      if (!newToken) {
        throw new Error("Token format error from server");
      }

      login(newToken, newRefresh || storedRefreshToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      // Solo redirigir si el usuario estaba logueado previamente para evitar bucles en el splash screen
      if (window.location.pathname !== "/login") {
        window.location.href = "https://ckarlosdev.github.io/login/";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
