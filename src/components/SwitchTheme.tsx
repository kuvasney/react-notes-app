import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function SwitchTheme() {
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const changeLight = () => setDarkMode(!darkMode);

  return (
    <button
      className="change-light"
      onClick={changeLight}
      title={t("navigation.switchTheme", {
        mode: darkMode ? t("navigation.light") : t("navigation.dark"),
      })}
    >
      {darkMode ? <FiSun /> : <FiMoon />}
    </button>
  );
}
