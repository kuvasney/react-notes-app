import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import {
  FiRefreshCw,
  FiPlusCircle,
  FiFileText,
  FiArchive,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";

import UserName from "../../UserName";
import LangSelector from "../../LangSelector";

export default function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchNotes } = useNotesApi();
  const { t } = useLanguage();

  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");
  const [isNotes, setIsNotes] = useState(location.pathname === "/notes");

  const { reset, setShowCreateForm } = useNotesStore();
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const { isLoggedIn, logout: authLogout } = useAuth();

  // Verificação extra para garantir sincronização
  const isAuthenticated =
    isLoggedIn || localStorage.getItem("isLoggedIn") === "true";

  // Atualizar estados quando a rota mudar
  useEffect(() => {
    setIsHomePage(location.pathname === "/");
    setIsNotes(location.pathname === "/notes");

    // // Debug
    // console.log("Navigator - Route changed:", {
    //   pathname: location.pathname,
    //   isHomePage: location.pathname === "/",
    //   isNotes: location.pathname === "/notes",
    //   isLoggedIn,
    // });
  }, [location.pathname, isLoggedIn]);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const changeLight = () => setDarkMode(!darkMode);

  function refetchNotes(archived: boolean) {
    fetchNotes(archived);
  }

  const logout = () => {
    try {
      reset();
      authLogout(); // Usa o logout do hook de autenticação
      // Navegar usando React Router (sem recarregar a página)
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error resetting notes store:", error);
      // Em caso de erro, fallback para navegação tradicional
      window.location.href = "/";
    }
  };

  return (
    <div className="wrapper-buttons">
      <div className="user-info">
        <NavLink to="/user" className="button-link user-link">
          <UserName />
        </NavLink>
      </div>
      <button
        className="change-light"
        onClick={changeLight}
        title={t("navigation.switchTheme", {
          mode: darkMode ? t("navigation.light") : t("navigation.dark"),
        })}
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>
      {isAuthenticated &&
        !isHomePage &&
        (isNotes ? (
          <NavLink
            to="/notes/archive"
            className="button-link"
            title={t("navigation.archivedNotes")}
          >
            <FiArchive />
          </NavLink>
        ) : (
          <NavLink
            to="/notes"
            className="button-link"
            title={t("navigation.activeNotes")}
          >
            <FiFileText />
          </NavLink>
        ))}
      {!isHomePage && (
        <>
          <button
            className="create-note-button"
            onClick={() => setShowCreateForm(true)}
            title={t("navigation.createNote")}
          >
            <FiPlusCircle />
          </button>
          <button
            onClick={() => refetchNotes(!isNotes)}
            title={t("navigation.reloadNotes")}
          >
            <FiRefreshCw />
          </button>
          <button onClick={logout}>
            <FiLogOut />
          </button>
        </>
      )}
      <LangSelector />
    </div>
  );
}
