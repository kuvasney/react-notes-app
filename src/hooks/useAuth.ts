import { useState, useEffect } from "react";

export const useAuth = () => {
  const validateLogin =
    localStorage.getItem("isLoggedIn") === "true" &&
    sessionStorage.getItem("userToken") !== null;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return validateLogin;
  });

  useEffect(() => {
    // Verificar periodicamente o estado de autenticação
    const checkAuthStatus = () => {
      const authStatus =
        localStorage.getItem("isLoggedIn") === "true" &&
        sessionStorage.getItem("userToken") !== null;

      if (authStatus !== isLoggedIn) {
        setIsLoggedIn(authStatus);
      }
    };

    // Verificar imediatamente
    checkAuthStatus();

    // Verificar a cada 100ms (bem rápido para garantir atualização)
    const interval = setInterval(checkAuthStatus, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const login = (email: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
};
