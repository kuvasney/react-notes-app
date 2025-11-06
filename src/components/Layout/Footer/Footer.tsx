import { useLanguage } from "@/contexts/LanguageContext";
import "./Footer.scss";

export default function Footer() {
  const { t } = useLanguage();

  return <div className="page-footer">{t("footer.copyright")}</div>;
}
