import { createContext, useContext, useState, ReactNode } from "react";
import {
  getDefaultLanguage,
  type SupportedLanguage,
  translations,
} from "@/i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    getDefaultLanguage()
  );

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  // Função de tradução simples (t = translate)
  const t = (
    key: string,
    variables?: Record<string, string | number>
  ): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    // Navega pelo objeto de traduções usando as chaves
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }

    // Se não for string, retorna a chave
    if (typeof value !== "string") {
      return key;
    }

    // Substituir variáveis {{variavel}} no texto
    if (variables) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
        return variables[varName]?.toString() || "";
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook customizado para usar o contexto de idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
