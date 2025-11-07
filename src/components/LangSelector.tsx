import { useLanguage } from "@/contexts/LanguageContext";
import { availableLanguages, type SupportedLanguage } from "@/i18n";

export default function LangSelector() {
  const { language, setLanguage } = useLanguage();

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang as SupportedLanguage);
  };

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="language-selector"
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
