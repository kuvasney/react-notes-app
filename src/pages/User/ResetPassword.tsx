import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserApi } from "../../hooks/useUserApi";
import { NavLink } from "react-router-dom";
import ToggleVisibility from "@/components/ToggleVisibility/ToggleVisibility";
import { FiAlertCircle } from "react-icons/fi";

export default function ResetPassword() {
  const { t } = useLanguage();
  const { passwordReset } = useUserApi();
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || "";

    if (password !== passwordRetype) {
      setError(t("auth.resetPassword.passwordsMustMatch"));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("auth.resetPassword.passwordMinLength"));
      setIsLoading(false);
      return;
    }

    try {
      await passwordReset(token, password);
      setSuccess(true);
      setPassword("");
      setPasswordRetype("");
    } catch (error) {
      setError(t("auth.resetPassword.error"));
      setExpired(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="form-container">
        <h2 className="section-title hwr">{t("auth.resetPassword.title")}</h2>
        <div className="input-container">
          <div className="input-container">
            <label className="input-password" htmlFor="password">
              {t("auth.resetPassword.password")}
              <ToggleVisibility
                isVisible={isPasswordVisible}
                onToggle={setIsPasswordVisible}
              />
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder={t("auth.resetPassword.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-container">
            <label className="input-password" htmlFor="passwordRetype">
              {t("auth.resetPassword.passwordRetype")}
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="passwordRetype"
              placeholder={t("auth.resetPassword.passwordRetype")}
              value={passwordRetype}
              onChange={(e) => setPasswordRetype(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="input-container message-container">
              <p className="error">
                <FiAlertCircle /> {error}
              </p>
              {expired && (
                <p>
                  <NavLink to="/">{t("auth.resetPassword.error2")} </NavLink>
                </p>
              )}
            </div>
          )}
          {success && (
            <div className="input-container message-container">
              <p className="success">{t("auth.resetPassword.success")}.</p>
              <p>
                <NavLink to="/">{t("auth.resetPassword.backToLogin")}.</NavLink>
              </p>
            </div>
          )}

          <div className="input-container">
            <button disabled={isLoading} onClick={handleResetPassword}>
              {isLoading
                ? t("auth.resetPassword.loading")
                : t("auth.resetPassword.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
