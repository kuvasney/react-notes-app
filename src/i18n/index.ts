/**
 * i18n (Internationalization) - Arquivos de tradução
 *
 * Estrutura dos arquivos de tradução:
 * - pt-BR.json: Português do Brasil
 * - en-US.json: Inglês (Estados Unidos)
 * - es-ES.json: Espanhol (Espanha)
 *
 * Para usar com bibliotecas de i18n como react-i18next ou react-intl
 */

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";

export const translations = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
};

export const availableLanguages = [
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "es-ES", name: "Español (España)", flag: "🇪🇸" },
];

// Função para detectar idioma suportado
export const getSupportedLanguage = (
  languageCode?: string
): SupportedLanguage => {
  const browserLang =
    languageCode || navigator.languages?.[0] || navigator.language;

  // Lista de idiomas suportados
  const supportedCodes = Object.keys(translations) as SupportedLanguage[];

  // 1. Verifica se o idioma exato é suportado
  if (supportedCodes.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  // 2. Verifica apenas o código base (pt, en, es)
  const baseLang = browserLang.split("-")[0];
  const match = supportedCodes.find((lang) => lang.startsWith(baseLang));

  if (match) {
    return match;
  }

  // 3. Fallback para pt-BR
  return "pt-BR";
};

// Função para obter o idioma padrão
export const getDefaultLanguage = (): SupportedLanguage => {
  // Tenta pegar do localStorage primeiro
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
    return savedLanguage as SupportedLanguage;
  }

  // Senão, detecta do browser
  return getSupportedLanguage();
};

export type SupportedLanguage = keyof typeof translations;

export default translations;
