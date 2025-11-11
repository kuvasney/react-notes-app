import { useState, useEffect } from "react";

export const useAuth = () => {
  // Inicializar diretamente do localStorage para evitar delay
  console.log("Checking auth status from localStorage");
  const validateLogin =
    localStorage.getItem("isLoggedIn") === "true" &&
    sessionStorage.getItem("userToken") !== null;
  console.log("Initial isLoggedIn:", validateLogin);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return validateLogin;
  });

  useEffect(() => {
    // Escutar mudanças no localStorage (útil para logout em outras abas)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isLoggedIn") {
        const authStatus = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(authStatus);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
