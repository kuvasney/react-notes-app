import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
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

export default function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isNotes = location.pathname === "/notes";

  const { reset, setShowCreateForm } = useNotesStore();
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const { refetch: refetchNotes } = useNotesApi();

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const changeLight = () => setDarkMode(!darkMode);

  const logout = () => {
    try {
      reset();
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
      <button
        className="change-light"
        onClick={changeLight}
        title={`Switch to ${darkMode ? "light" : "dark"} mode`}
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>
      {isNotes ? (
        <NavLink
          to="/notes/archive"
          className="button-link"
          title="Archived Notes"
        >
          <FiArchive />
        </NavLink>
      ) : (
        <NavLink to="/notes" className="button-link" title="Active notes">
          <FiFileText />
        </NavLink>
      )}
      {!isHomePage && (
        <>
          <button
            className="create-note-button"
            onClick={() => setShowCreateForm(true)}
            title="Create New Note"
          >
            <FiPlusCircle />
          </button>
          <button onClick={refetchNotes} title=" Reload Notes">
            <FiRefreshCw />
          </button>
          <button onClick={logout}>
            <FiLogOut />
          </button>
        </>
      )}
    </div>
  );
}
