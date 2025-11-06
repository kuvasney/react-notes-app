import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  const { t } = useLanguage();

  return (
    <div className="content-wrapper">
      <h1 className="hwr">{t("auth.register.title")}</h1>
      <RegisterForm />
      <p>
        {t("auth.login.noAccount")}{" "}
        <NavLink to="/">{t("auth.register.loginLink")}</NavLink>.
      </p>
    </div>
  );
}
