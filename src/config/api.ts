/**
 * Configurações da API
 */
import type { ApiConfig, EnvironmentConfig, ApiEndpoints } from "@/types/api";

// Configuração base da API
export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
  },
};

// Função para obter headers com token dinâmico
export const getAuthHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem("userToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Endpoints da API
export const API_ENDPOINTS: ApiEndpoints = {
  notes: "/api/notes",
  reorder: "/api/notes/reorder",
  auth: "/api/users/login",
  users: "/api/users",
};

// Configurações de ambiente
export const ENV_CONFIG: EnvironmentConfig = {
  isDevelopment: import.meta.env.VITE_NODE_ENV === "development",
  isProduction: import.meta.env.VITE_NODE_ENV === "production",
  debugMode: import.meta.env.VITE_DEBUG_MODE === "true",
};

// Função helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.baseURL.replace(/\/$/, ""); // Remove barra no final
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Log de configuração (apenas em desenvolvimento)
if (ENV_CONFIG.isDevelopment && ENV_CONFIG.debugMode) {
  console.log("🔧 API Configuration:", {
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    environment: import.meta.env.VITE_NODE_ENV,
  });
}
