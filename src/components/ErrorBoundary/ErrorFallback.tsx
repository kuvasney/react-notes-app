import { FallbackProps } from "react-error-boundary";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import "./ErrorBoundary.scss";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { t } = useLanguage();

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="error-boundary-container">
      <div className="error-boundary-content">
        <FiAlertTriangle className="error-icon" />
        <h1>{t("error.title")}</h1>
        <p className="error-message">{t("error.message")}</p>

        <details className="error-details">
          <summary>{t("error.technicalDetails")}</summary>
          <pre className="error-stack">
            <code>{error.message}</code>
            {error.stack && (
              <>
                <hr />
                <code>{error.stack}</code>
              </>
            )}
          </pre>
        </details>

        <div className="error-actions">
          <button onClick={resetErrorBoundary} className="btn-primary">
            <FiRefreshCw />
            {t("error.tryAgain")}
          </button>
          <button onClick={handleGoHome} className="btn-secondary">
            <FiHome />
            {t("error.goHome")}
          </button>
        </div>

        <p className="error-help-text">{t("error.persistMessage")}</p>
      </div>
    </div>
  );
}
