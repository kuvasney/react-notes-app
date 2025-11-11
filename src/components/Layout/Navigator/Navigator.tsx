import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotesStore } from "@/stores/notesStore";
import { useAuth } from "@/hooks/useAuth";
// import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import UserName from "../../UserName";
import LangSelector from "../../LangSelector";
import SwitchTheme from "@/components/SwitchTheme";

export default function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { t } = useLanguage();

  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");

  const { reset } = useNotesStore();

  const { isLoggedIn, logout: authLogout } = useAuth();

  // Verificação extra para garantir sincronização
  const isAuthenticated = isLoggedIn;

  // Atualizar estados quando a rota mudar
  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location.pathname, isLoggedIn]);

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
      {isAuthenticated && (
        <>
          <div className="user-info">
            <NavLink to="/user" className="button-link user-link">
              <UserName />
            </NavLink>
          </div>
          {!isHomePage && (
            <>
              <button onClick={logout}>
                <FiLogOut />
              </button>
            </>
          )}
        </>
      )}
      {!isAuthenticated && !isHomePage && (
        <NavLink to="/" className="button-link">
          {/* {t("layout.navigator.home")} */}Login
        </NavLink>
      )}
      <SwitchTheme />
      <LangSelector />
    </div>
  );
}
