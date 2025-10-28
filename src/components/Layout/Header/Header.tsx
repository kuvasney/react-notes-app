import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotesStore } from "@/stores/notesStore";
import { FiSun, FiMoon, FiClipboard, FiLogOut } from "react-icons/fi";

import "./Header.scss";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useNotesStore();
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const isHomePage = location.pathname === "/";

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
    <div className="page-header">
      <h1 className="hwr">
        <FiClipboard /> Take Note!
      </h1>
      <div className="wrapper-buttons">
        {!isHomePage && (
          <button onClick={logout}>
            <FiLogOut />
          </button>
        )}
        <button className="change-light" onClick={changeLight}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </div>
  );
}
