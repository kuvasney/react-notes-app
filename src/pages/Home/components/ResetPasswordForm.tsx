import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useUserApi } from "@/hooks/useUserApi";
import { useLanguage } from "@/contexts/LanguageContext";
import "./LoginForm.scss";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();
  const { passwordForgot } = useUserApi();

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error(t("auth.resetPassword.emailRequired"));
      }

      await passwordForgot(email.trim());
      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="password-email-form">
      <h2 className="password-reset-title section-title hwr">
        {t("auth.resetPassword.title")}
      </h2>
      <form onSubmit={handleEmailReset}>
        <div className="input-container">
          <label htmlFor="email">
            {t("auth.resetPassword.emailInstruction")}
          </label>
          <input
            type="email"
            placeholder={t("auth.resetPassword.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {isLoading
            ? t("auth.resetPassword.loading")
            : t("auth.resetPassword.submit")}
        </button>
      </form>
      {success && (
        <div className="input-container">
          <p className="success success-message">
            {t("auth.resetPassword.emailSent")}
          </p>
        </div>
      )}
    </section>
  );
}
