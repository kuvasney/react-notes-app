import { useState, useEffect } from "react";

export const useAuth = () => {
  // Inicializar diretamente do localStorage para evitar delay
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
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
    console.log("useAuth - Login executado:", { email, isLoggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
};
