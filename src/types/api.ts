/**
 * Tipos para configuração da API e variáveis de ambiente
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  debugMode: boolean;
}

export interface ApiEndpoints {
  notes: string;
  auth: string;
}

// Extender o módulo de variáveis de ambiente do Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_DEBUG_MODE: string;
    // Adicione outras variáveis conforme necessário
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
