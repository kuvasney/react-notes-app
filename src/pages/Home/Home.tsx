import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import LoginForm from "./components/LoginForm";

export default function Home() {
  const { t } = useLanguage();

  usePageMeta({
    title: "Take Note - Login",
    description:
      t("auth.login.description") ||
      "Organize your ideas with simplicity and total security. Your notes, simple and secure.",
  });

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
