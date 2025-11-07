import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FiAlertCircle } from "react-icons/fi";
import { useUserApi } from "@/hooks/useUserApi";
import { useUserStore } from "@/stores/userStore";
import { useLanguage } from "@/contexts/LanguageContext";
import ToggleVisibility from "@/components/ToggleVisibility/ToggleVisibility";
import "./LoginForm.scss";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { loginUser } = useUserApi();
  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error(t("auth.login.emailRequired"));
      }
      if (!password.trim()) {
        throw new Error(t("auth.login.passwordRequired"));
      }
      const response = await loginUser(email.trim(), password.trim());
      if (response.tokens) {
        login(response.tokens); // Atualiza o estado de autenticação
        localStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        sessionStorage.setItem("userToken", response.tokens.accessToken);
        // Verifica se há redirecionamento pendente
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        console.log("Redirecting to:", redirectPath);
        navigate(redirectPath || "/notes");
        sessionStorage.removeItem("redirectAfterLogin");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //   // Supondo que a resposta contenha um token ou indicador de sucesso
  //   if (response.token) {
  //     login(response.token); // Atualiza o estado de autenticação

  //   // Verifica se há redirecionamento pendente
  //   const redirectPath = sessionStorage.getItem("redirectAfterLogin");
  //   sessionStorage.removeItem("redirectAfterLogin");

  //   navigate(redirectPath || "/notes");
  // } else {
  //   setError("Email ou senha inválidos");
  // }

  // setIsLoading(false);
  //   };
  // }

  return (
    <section className="login">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <label className="password-label">
            <ToggleVisibility
              isVisible={isPasswordVisible}
              onToggle={setIsPasswordVisible}
            />
          </label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder={t("auth.login.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="input-container">
          {error && (
            <div className="error">
              <FiAlertCircle /> {error}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
        </button>
      </form>
    </section>
  );
}
