import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LoginForm from "./components/LoginForm";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="content-wrapper">
      <LoginForm />
      <p>
        {t("auth.login.noAccount")}{" "}
        <NavLink to="/register">{t("auth.login.registerLink")}</NavLink>.
      </p>
    </div>
  );
}
