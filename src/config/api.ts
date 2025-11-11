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

export const handleUnauthorizedResponse = () => {
  // Limpar dados de autenticação
  sessionStorage.clear();
  localStorage.clear();
  // Redirecionar para a página de login
  window.location.href = "/";
};

// Wrapper global para fetch com interceptação de 401
export const apiFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    // Interceptar resposta 401 (Unauthorized)
    if (response.status === 401) {
      handleUnauthorizedResponse();
      throw new Error("Unauthorized - Redirecting to login");
    }

    return response;
  } catch (error) {
    // Re-lançar o erro para que o código que chamou possa tratá-lo
    throw error;
  }
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
