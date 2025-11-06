import { useState } from "react";
import { useUserApi } from "@/hooks/useUserApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import ToggleVisibility from "@/components/ToggleVisibility/ToggleVisibility";
import "./RegisterForm.scss";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { registerUser } = useUserApi();
  const { t } = useLanguage();

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);
    setIsLoading(true);
    setIsPasswordVisible(false);

    try {
      // Validações básicas
      if (!name.trim()) {
        throw new Error(t("auth.register.nameRequired"));
      }
      if (!email.trim()) {
        throw new Error(t("auth.login.emailRequired"));
      }
      if (!password.trim() || password.length < 6) {
        throw new Error(t("auth.register.passwordMinLength"));
      }

      const userObject = {
        username: name.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      await registerUser(
        userObject.username,
        userObject.email,
        userObject.password
      );
      setIsSuccess(true);
      // Limpar formulário após sucesso
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleCreateUser}>
      <div className="input-container">
        <label htmlFor="name">{t("auth.register.name")}</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="email">{t("auth.register.email")}</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="password">
          {t("auth.register.password")}
          <ToggleVisibility
            isVisible={isPasswordVisible}
            onToggle={setIsPasswordVisible}
          />
        </label>
        <input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">{t("auth.register.registerButton")}</button>
      {isLoading && <p>{t("auth.register.registering")}</p>}
      {error && (
        <p className="error-message">
          <FiAlertCircle /> {error}
        </p>
      )}
      {isSuccess && (
        <p className="success-message">
          <FiCheckCircle /> {t("auth.register.success")}
        </p>
      )}
    </form>
  );
}
